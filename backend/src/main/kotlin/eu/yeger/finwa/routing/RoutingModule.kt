package eu.yeger.finwa.routing

import eu.yeger.finwa.model.api.HeartbeatRequest
import eu.yeger.finwa.model.api.HeartbeatResponse
import io.ktor.application.*
import io.ktor.locations.*
import io.ktor.response.*
import io.ktor.routing.*

public fun Application.routingModule() {
    install(Locations)

    routing {
        post<HeartbeatRequest>("heartbeat") { request ->
            call.respond(HeartbeatResponse(message = "FinWa-Backend", url = request.url))
        }
        route("api") {
            route("users", Route::userRoutes)
        }
    }
}

@Location("/location/{name}")
public class MyLocation(public val name: String, public val arg1: Int = 42, public val arg2: String = "default")
