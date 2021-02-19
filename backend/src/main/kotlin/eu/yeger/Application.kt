package eu.yeger

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.metrics.micrometer.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.serialization.*
import io.micrometer.prometheus.*
import org.slf4j.event.*

public fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
public fun Application.mainModule() {

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
        header("MyCustomHeader")
        allowCredentials = true
        anyHost() // @TODO: Don't do this in production if possible. Try to limit it.
    }
    install(DefaultHeaders) {
        header("X-Engine", "Ktor") // will send this header with each response
    }
    install(Locations) {
    }

    install(ContentNegotiation) {
        json()
    }

    val appMicrometerRegistry = PrometheusMeterRegistry(PrometheusConfig.DEFAULT)

    install(MicrometerMetrics) {
        registry = appMicrometerRegistry
    }
//    authentication {
//        basic(name = "myauth1") {
//            realm = "Ktor Server"
//            validate { credentials ->
//                if (credentials.name == credentials.password) {
//                    UserIdPrincipal(credentials.name)
//                } else {
//                    null
//                }
//            }
//        }
//
//        form(name = "myauth2") {
//            userParamName = "user"
//            passwordParamName = "password"
//            challenge {
//                /**/
//            }
//        }
//    }
//    val jwtIssuer = environment.config.property("jwt.domain").getString()
//    val jwtAudience = environment.config.property("jwt.audience").getString()
//    val jwtRealm = environment.config.property("jwt.realm").getString()
//    authentication {
//        jwt {
//            realm = jwtRealm
//            verifier(makeJwtVerifier(jwtIssuer, jwtAudience))
//            validate { credential ->
//                if (credential.payload.audience.contains(jwtAudience)) JWTPrincipal(credential.payload) else null
//            }
//        }
//    }
    routing {
        get("/") {
            call.respondText("Hello World!")
        }
    }
    routing {
        get<MyLocation> {
            call.respondText("Location: name=${it.name}, arg1=${it.arg1}, arg2=${it.arg2}")
        }
        // Register nested routes
        get<Type.Edit> {
            call.respondText("Inside $it")
        }
        get<Type.List> {
            call.respondText("Inside $it")
        }
    }
    routing {
        install(StatusPages) {
            exception<AuthenticationException> { cause ->
                call.respond(HttpStatusCode.Unauthorized)
            }
            exception<AuthorizationException> { cause ->
                call.respond(HttpStatusCode.Forbidden)
            }
        }
    }
    routing {
        get("/json/kotlinx-serialization") {
            call.respond(mapOf("hello" to "world"))
        }
    }
    routing {
        get("/metrics-micrometer") {
            call.respond(appMicrometerRegistry.scrape())
        }
    }
//    routing {
//        authenticate("myauth1") {
//            get("/protected/route/basic") {
//                val principal = call.principal<UserIdPrincipal>()!!
//                call.respondText("Hello ${principal.name}")
//            }
//        }
//        authenticate("myauth1") {
//            get("/protected/route/form") {
//                val principal = call.principal<UserIdPrincipal>()!!
//                call.respondText("Hello ${principal.name}")
//            }
//        }
//    }
}

@Location("/location/{name}")
public class MyLocation(public val name: String, public val arg1: Int = 42, public val arg2: String = "default")

@Location("/type/{name}")
public data class Type(val name: String) {
    @Location("/edit")
    public data class Edit(val type: Type)

    @Location("/list/{page}")
    public data class List(val type: Type, val page: Int)
}

public class AuthenticationException : RuntimeException()
public class AuthorizationException : RuntimeException()

private val algorithm = Algorithm.HMAC256("secret")
private fun makeJwtVerifier(issuer: String, audience: String): JWTVerifier = JWT
    .require(algorithm)
    .withAudience(audience)
    .withIssuer(issuer)
    .build()
