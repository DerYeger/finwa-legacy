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
import eu.yeger.finwa.repository.user.UserRepository
import eu.yeger.finwa.utils.toResult
import mu.KotlinLogging

private val loginFailed: ResponseEntity<TranslationDTO> = unauthorized(TranslationDTO("login.error.credentials"))

public class UserService(
    private val userRepository: UserRepository
) {
    private val logger = KotlinLogging.logger {}

    public suspend fun getAll(): ApiResult<List<User>> {
        return userRepository
            .getAll()
            .map(PersistentUser::toUser)
            .toResult(::ok)
    }

    public suspend fun getById(id: String): ApiResult<User> {
        return userRepository
            .validateUserWithIdExists(id)
            .map(PersistentUser::toUser)
            .map(::ok)
    }

    public suspend fun create(user: User): ApiResult<User> {
        return userRepository
            .validateUserIdIsAvailable(user.id)
            .andThen { userRepository.validateUserNameIsAvailable(user.name) }
            .map { user.withHashedPassword() }
            .onSuccess { hashedUser -> userRepository.save(hashedUser.toPersistentUser()) }
            .map { hashedUser -> hashedUser.copy(password = "") }
            .map(::created)
    }

    public suspend fun deleteById(id: String): ApiResult<Unit> {
        return userRepository
            .validateUserWithIdExists(id)
            .onSuccess { user ->
                userRepository.deleteById(user.id)
                if (userRepository.isEmpty()) {
                    createDefaultUserIfRequired()
                }
            }
            .map { ok(Unit) }
    }

    public suspend fun createDefaultUserIfRequired() {
        val username = Arguments.defaultUsername
        val password = Arguments.defaultPassword
        if (userRepository.isEmpty()) {
            logger.info { "No existing users" }
            val user = User(name = username, password = password).withHashedPassword().toPersistentUser()
            userRepository.save(user)
            logger.info { "Created default user ${user.name}" }
        } else {
            logger.info { "Found existing users" }
        }
    }

    public suspend fun loginUser(credentials: Credentials): ApiResult<ApiToken> {
        return userRepository
            .validateUserWithNameExists(credentials.username)
            .map(PersistentUser::toUser)
            .andThen { user -> credentials.validateForUser(user) }
            .map(JWTConfiguration::makeToken)
            .mapError { loginFailed }
            .map(::ok)
    }

    private fun Credentials.validateForUser(user: User): IntermediateResult<User> {
        return when (this matches user) {
            true -> Ok(user)
            false -> Err(loginFailed)
        }
    }
}
