package eu.yeger.finwa.auth

import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.routing.*

public fun Application.authModule() {
    authentication {
        jwt {
            verifier(JWTConfiguration.verifier)
            validate { credential ->
                if (credential.payload.audience.contains(JWTConfiguration.audience)) JWTPrincipal(credential.payload) else null
            }
        }
    }
    routing {
        route("auth") {
            authRoutes()
        }
    }
}
