package eu.yeger.finwa.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import eu.yeger.finwa.Arguments
import eu.yeger.finwa.model.api.ApiToken
import eu.yeger.finwa.model.domain.User
import java.util.*
import java.util.concurrent.TimeUnit

public object JWTConfiguration {
    private val issuer: String = Arguments.domain
    public const val audience: String = "finwa"

    private val duration: Long = TimeUnit.DAYS.toMillis(30)

    private val algorithm = Algorithm.HMAC256(UUID.randomUUID().toString())
    public val verifier: JWTVerifier = JWT
        .require(algorithm)
        .withAudience(audience)
        .withIssuer(issuer)
        .build()

    public fun makeToken(user: User): ApiToken {
        val expiration = Date(System.currentTimeMillis() + duration)
        val token = JWT.create()
            .withSubject(user.name)
            .withAudience(audience)
            .withIssuer(issuer)
            .withExpiresAt(expiration)
            .sign(algorithm)
        return ApiToken(token, expiration.time)
    }
}
