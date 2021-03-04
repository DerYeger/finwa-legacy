package eu.yeger.finwa.routing

import eu.yeger.finwa.model.api.HeartbeatRequest
import eu.yeger.finwa.model.api.HeartbeatResponse
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.response.*
import io.ktor.routing.*

public fun Application.routingModule() {
  routing {
    post<HeartbeatRequest>("heartbeat") { request ->
      call.respond(HeartbeatResponse(message = "FinWa-Backend", url = request.url))
    }
    val authenticationInstalled = application.featureOrNull(Authentication) != null
    if (authenticationInstalled) {
      application.log.info("Authentication feature detected, API routes will be secured")
      authenticate {
        apiRoutes()
      }
    } else {
      application.log.info("Authentication feature not detected, API routes will not be secured")
      apiRoutes()
    }
  }
}
