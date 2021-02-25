package eu.yeger.finwa.routing

import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*

public fun Application.routingModule() {
    routing {
        get("/heartbeat") {
            call.respondText("FinWa-Backend")
        }
        route("/api") {
            // TODO
        }
    }
}
