package eu.yeger.finwa

import eu.yeger.finwa.service.UserService
import io.ktor.application.*
import kotlinx.coroutines.runBlocking
import org.koin.ktor.ext.inject

public fun Application.initializationModule() {
  val userService: UserService by inject()
  runBlocking {
    userService.createDefaultUserIfRequired()
  }
}
