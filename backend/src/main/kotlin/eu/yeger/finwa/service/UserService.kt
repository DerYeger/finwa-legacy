package eu.yeger.finwa.service

import com.github.michaelbull.result.*
import eu.yeger.finwa.Arguments
import eu.yeger.finwa.auth.JWTConfiguration
import eu.yeger.finwa.auth.matches
import eu.yeger.finwa.auth.withHashedPassword
import eu.yeger.finwa.model.api.*
import eu.yeger.finwa.model.domain.User
import eu.yeger.finwa.model.domain.toPersistentUser
import eu.yeger.finwa.model.persistence.PersistentUser
import eu.yeger.finwa.model.persistence.toUser
import eu.yeger.finwa.repository.UserRepository
import eu.yeger.finwa.utils.toResult
import io.ktor.http.*
import mu.KotlinLogging

private val loginFailed: ResponseEntity<TranslationDTO> = unauthorized(TranslationDTO("login.error.credentials"))

public class UserService(
    private val userRepository: UserRepository
) {
    private val logger = KotlinLogging.logger {}

    public suspend fun getAll(): ApiResult<ResponseEntity<List<User>>> {
        return userRepository
            .getAll()
            .map(PersistentUser::toUser)
            .toResult<List<User>, ResponseEntity<TranslationDTO>>()
            .map(::ok)
    }

    public suspend fun createDefaultUserIfRequired() {
        val username = Arguments.defaultUsername
        val password = Arguments.defaultPassword
        if (userRepository.isEmpty()) {
            logger.info { "No existing users" }
            val user = User(name = username, password = password).withHashedPassword().toPersistentUser()
            userRepository.save(user)
            logger.info { "Created default user" }
        } else {
            logger.info { "Found existing users" }
        }
    }

    public suspend fun loginUser(credentials: Credentials): ApiResult<ResponseEntity<ApiToken>> {
        return userRepository
            .validateUserExists(credentials.username)
            .map(PersistentUser::toUser)
            .andThen { user -> credentials.validateForUser(user) }
            .map { user -> JWTConfiguration.makeToken(user) }
            .mapError { loginFailed }
            .map { token -> ResponseEntity(HttpStatusCode.OK, token) }
    }

    private fun Credentials.validateForUser(user: User): ApiResult<User> {
        return when (this matches user) {
            true -> Ok(user)
            false -> Err(loginFailed)
        }
    }
}
