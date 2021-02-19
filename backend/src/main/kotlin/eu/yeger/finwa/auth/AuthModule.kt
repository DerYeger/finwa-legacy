package eu.yeger.finwa.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import eu.yeger.finwa.Arguments
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.routing.*
import java.util.*

private val jwtIssuer = Arguments.domain
private const val jwtAudience = "finwa"
private const val jwtRealm = "FinWa Server"

private val jwtAlgorithm = Algorithm.HMAC256(UUID.randomUUID().toString())
private val jwtVerifier: JWTVerifier = JWT
    .require(jwtAlgorithm)
    .withAudience(jwtAudience)
    .withIssuer(jwtIssuer)
    .build()

public fun Application.authModule() {
    authentication {
        basic(name = "myauth1") {
            realm = "Ktor Server"
            validate { credentials ->
                if (credentials.name == credentials.password) {
                    UserIdPrincipal(credentials.name)
                } else {
                    null
                }
            }
        }

        form(name = "myauth2") {
            userParamName = "user"
            passwordParamName = "password"
            challenge {
                /**/
            }
        }

        jwt {
            realm = jwtRealm
            verifier(jwtVerifier)
            validate { credential ->
                if (credential.payload.audience.contains(jwtAudience)) JWTPrincipal(credential.payload) else null
            }
        }
    }
    routing {
        authRoutes()
    }
}
