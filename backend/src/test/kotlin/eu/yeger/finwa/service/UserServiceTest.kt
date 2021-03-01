package eu.yeger.finwa.service

import com.github.michaelbull.result.get
import eu.yeger.finwa.model.persistence.PersistentUser
import eu.yeger.finwa.repository.user.InMemoryUserRepository
import eu.yeger.finwa.repository.user.UserRepository
import io.kotest.matchers.collections.shouldContainAll
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

private val testUser = PersistentUser("test", "test", "test")
private val secondTestUser = PersistentUser("test1", "test1", "test")

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
        result.data.map { it.id to it.name } shouldContainAll listOf(testUser, secondTestUser).map { it.id to it.name }
    }

    @Test
    fun `verify that a default user is created if none exists`() = runBlocking {
        // When repository is empty
        userRepository.getAll().isEmpty() shouldBe true

        // Then a default user should be created
        userService.createDefaultUserIfRequired()
        userRepository.getAll().size shouldBe 1
        userRepository.getByName("finwa") shouldNotBe null
    }

    @Test
    fun `verify that no default user is created if any exist`() = runBlocking {
        // When repository is not empty
        userRepository.save(testUser)
        userRepository.getAll().size shouldBe 1

        // Then no default user should be created
        userService.createDefaultUserIfRequired()
        userRepository.getAll().size shouldBe 1
        userRepository.getByName("finwa") shouldBe null
    }
}
