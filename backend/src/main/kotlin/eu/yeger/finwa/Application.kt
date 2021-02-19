package eu.yeger.finwa

import eu.yeger.finwa.auth.authModule
import eu.yeger.finwa.locations.locationsModule
import eu.yeger.finwa.monitoring.monitoringModule
import eu.yeger.finwa.routing.routingModule
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.serialization.*
import kotlinx.serialization.SerializationException
import kotlinx.serialization.json.Json
import org.slf4j.event.*

public fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
public fun Application.mainModule() {
    authModule()
    monitoringModule()
    locationsModule()
    routingModule()

    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.path().startsWith("/") }
    }

    install(CORS) {
        method(HttpMethod.Options)
        method(HttpMethod.Put)
        method(HttpMethod.Delete)
        method(HttpMethod.Patch)
        header(HttpHeaders.Authorization)
        anyHost()
        allowNonSimpleContentTypes = true
        allowSameOrigin = true
    }

    install(DefaultHeaders)

    install(ContentNegotiation) {
        json(
            json = Json {
                encodeDefaults = false
                ignoreUnknownKeys = true
            }
        )
    }

    install(StatusPages) {
        exception<Throwable> { cause ->
            call.respond(HttpStatusCode.InternalServerError, cause.message ?: "api.error.unknown")
            throw cause
        }
        exception<SerializationException> { cause ->
            call.respond(HttpStatusCode.BadRequest, cause.message ?: "api.error.serialization")
        }
    }
}
