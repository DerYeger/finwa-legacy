package eu.yeger.finwa.routing

import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*

public fun Application.routingModule() {
    routing {
        get("/") {
            call.respondText("Hello World!")
        }
    }
}
