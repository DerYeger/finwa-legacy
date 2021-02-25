package eu.yeger.finwa.routing

import eu.yeger.finwa.model.api.HeartbeatRequest
import eu.yeger.finwa.model.api.HeartbeatResponse
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*

public fun Application.routingModule() {
    routing {
        post<HeartbeatRequest>("/heartbeat") { request ->
            call.respond(HeartbeatResponse(message = "FinWa-Backend", url = request.url))
        }
        route("/api") {
            // TODO
        }
    }
}
