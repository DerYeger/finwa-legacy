package eu.yeger.finwa.routing

import eu.yeger.finwa.model.api.respondWithResult
import eu.yeger.finwa.service.UserService
import io.ktor.routing.*
import org.koin.ktor.ext.inject

public fun Route.userRoutes() {
    val userService: UserService by inject()

    get {
        respondWithResult(userService.getAll())
    }
}
