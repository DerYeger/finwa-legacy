package eu.yeger.finwa.service

import eu.yeger.finwa.repository.user.InMemoryUserRepository
import eu.yeger.finwa.repository.user.UserRepository
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class UserServiceTest {

    private lateinit var userRepository: UserRepository
    private lateinit var userService: UserService

    @BeforeEach
    fun setup() {
        userRepository = InMemoryUserRepository()
        userService = UserService(userRepository)
    }

    @Test
    fun `test creation of default user`() = runBlocking {
        // When repository is empty
        userRepository.getAll().isEmpty() shouldBe true

        // Then a default user should be created
        userService.createDefaultUserIfRequired()
        userRepository.getAll().isEmpty() shouldBe false
        userRepository.getByName("finwa") shouldNotBe null
    }
}
