package eu.yeger.finwa.service

import com.github.michaelbull.result.get
import com.github.michaelbull.result.getError
import eu.yeger.finwa.Arguments
import eu.yeger.finwa.model.api.Credentials
import eu.yeger.finwa.model.api.TranslationDTO
import eu.yeger.finwa.model.domain.User
import eu.yeger.finwa.model.persistence.PersistentUser
import eu.yeger.finwa.model.persistence.toUser
import eu.yeger.finwa.repository.user.InMemoryUserRepository
import eu.yeger.finwa.repository.user.UserRepository
import io.kotest.matchers.collections.shouldContainAll
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

private val testUser = PersistentUser("testId", "testName", "testPassword")
private val secondTestUser = PersistentUser("testId2", "testName2", "testPassword2")

private fun User.extractUserIdAndName() = id to name
private fun PersistentUser.extractUserIdAndName() = id to name

class UserServiceTest {

    private lateinit var userRepository: UserRepository
    private lateinit var userService: UserService

    @BeforeEach
    fun setup() {
        userRepository = InMemoryUserRepository()
        userService = UserService(userRepository)
    }

    @Test
    fun `verify that retrieving users works`() = runBlocking {
        // When repository contains users
        userRepository.save(testUser)
        userRepository.save(secondTestUser)
        userRepository.getAll().size shouldBe 2

        // Then all users should be retrieved
        val result = userService.getAll().get()!!
        result.status shouldBe HttpStatusCode.OK
        result.data.size shouldBe 2
        result.data.map(User::extractUserIdAndName) shouldContainAll listOf(testUser, secondTestUser).map(PersistentUser::extractUserIdAndName)
    }

    @Test
    fun `verify that retrieving user by id works`() = runBlocking {
        // When user exists
        userRepository.save(testUser)
        userRepository.getAll().size shouldBe 1

        // Then it should be retrieved by id
        val result = userService.getById(testUser.id).get()!!
        result.status shouldBe HttpStatusCode.OK
        result.data.extractUserIdAndName() shouldBe testUser.extractUserIdAndName()
    }

    @Test
    fun `verify that retrieving user by id does not work if id does not exist`() = runBlocking {
        // When user does not exist
        userRepository.save(testUser)
        userRepository.getAll().size shouldBe 1

        // Then it should not be retrieved by id
        val result = userService.getById("randomId").getError()!!
        result.status shouldBe HttpStatusCode.NotFound
        result.data shouldBe TranslationDTO("api.error.user.not-found")
    }

    @Test
    fun `verify that creating user works`() = runBlocking {
        // When id and name are available
        userRepository.isEmpty() shouldBe true

        // Then the user should be created
        val result = userService.create(testUser.toUser()).get()!!
        result.status shouldBe HttpStatusCode.Created
        result.data.extractUserIdAndName() shouldBe testUser.extractUserIdAndName()
    }

    @Test
    fun `verify that user is not created if id or name are in use`() = runBlocking {
        // When id or name are not available
        userRepository.save(testUser)
        userRepository.getAll().size shouldBe 1

        val newUserTemplate = User(id = "newId", name = "newName", password = "password")

        // Then the user should not be
        val idTakenResult = userService.create(newUserTemplate.copy(id = testUser.id)).getError()!!
        idTakenResult.status shouldBe HttpStatusCode.Conflict
        idTakenResult.data shouldBe TranslationDTO("api.error.user.id-taken")

        val nameTakenResult = userService.create(newUserTemplate.copy(name = testUser.name)).getError()!!
        nameTakenResult.status shouldBe HttpStatusCode.Conflict
        nameTakenResult.data shouldBe TranslationDTO("api.error.user.name-taken")
    }

    @Test
    fun `verify that a default user is created if no user exists`() = runBlocking {
        // When repository is empty
        userRepository.isEmpty() shouldBe true

        // Then a default user should be created
        userService.createDefaultUserIfRequired()
        userRepository.getAll().size shouldBe 1
        userRepository.getByName(Arguments.defaultUsername) shouldNotBe null
    }

    @Test
    fun `verify that no default user is created if any user exists`() = runBlocking {
        // When repository is not empty
        userRepository.save(testUser)
        userRepository.getAll().size shouldBe 1

        // Then no default user should be created
        userService.createDefaultUserIfRequired()
        userRepository.getAll().size shouldBe 1
        userRepository.getByName(Arguments.defaultUsername) shouldBe null
    }

    @Test
    fun `verify that login works`() = runBlocking {
        // When a user exists
        userService.create(testUser.toUser()).get()!!.status shouldBe HttpStatusCode.Created

        // Then a login should be possible
        val loginResult = userService.loginUser(Credentials(username = testUser.name, password = testUser.password)).get()!!
        loginResult.status shouldBe HttpStatusCode.OK
    }

    @Test
    fun `verify that login does not work with invalid credentials`() = runBlocking {
        // When a user exists
        userService.create(testUser.toUser()).get()!!.status shouldBe HttpStatusCode.Created

        // Then a login should not be possible with invalid credentials
        userService.loginUser(Credentials(username = testUser.name, password = "wrongPassword")).getError()!!.status shouldBe HttpStatusCode.Unauthorized
        userService.loginUser(Credentials(username = "wrongUsername", password = testUser.name)).getError()!!.status shouldBe HttpStatusCode.Unauthorized
    }

    @Test
    fun `verify that deleting user by id works`() = runBlocking {
        // When a user with the given id exists
        userRepository.save(testUser)
        userRepository.save(secondTestUser)

        // Then it should be possible to delete it
        val deletionResult = userService.deleteById(testUser.id).get()!!
        deletionResult.status shouldBe HttpStatusCode.OK
        userRepository.getAll().size shouldBe 1
        userRepository.getAll()[0].extractUserIdAndName() shouldBe secondTestUser.extractUserIdAndName()
    }

    @Test
    fun `verify that deleting user by id does not work if id does not exist`() = runBlocking {
        // When no user with the given id exists
        userRepository.save(testUser)
        userRepository.save(secondTestUser)

        // Then it should not delete any users
        val deletionResult = userService.deleteById("randomId").getError()!!
        deletionResult.status shouldBe HttpStatusCode.NotFound
        userRepository.getAll().size shouldBe 2
    }

    @Test
    fun `verify that deleting user recreates default user if required`() = runBlocking {
        // When the last user is deleted
        userRepository.save(testUser)
        userRepository.getAll().size shouldBe 1
        userService.deleteById(testUser.id).get()!!.status shouldBe HttpStatusCode.OK

        // Then the default user should be recreated
        userRepository.isEmpty() shouldBe false
        userRepository.getByName(Arguments.defaultUsername) shouldNotBe null
    }
}
