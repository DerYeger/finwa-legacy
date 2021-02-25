package eu.yeger.finwa.auth

import eu.yeger.finwa.model.api.Credentials
import eu.yeger.finwa.model.api.respondWithResult
import eu.yeger.finwa.service.UserService
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.response.*
import io.ktor.routing.*
import org.koin.ktor.ext.inject

public fun Routing.authRoutes() {
    val userService: UserService by inject()
    route("auth") {
        post<Credentials>("login") { credentials ->
            val result = userService.loginUser(credentials)
            respondWithResult(result)
        }
    }
}
