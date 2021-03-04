package eu.yeger.finwa.auth

import eu.yeger.finwa.model.api.Credentials
import eu.yeger.finwa.service.UserService
import eu.yeger.finwa.utils.post
import io.ktor.routing.*
import org.koin.ktor.ext.inject

public fun Route.authRoutes() {
  val userService: UserService by inject()

  post("login") { credentials: Credentials -> userService.loginUser(credentials) }
}
