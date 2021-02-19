package eu.yeger.finwa

import io.kotest.matchers.shouldBe
import io.ktor.http.*
import io.ktor.server.testing.*
import org.junit.jupiter.api.Test

class ApplicationTest {

    @Test
    fun testRoot() {
        withTestApplication({
            mainModule()
        }) {
            handleRequest(HttpMethod.Get, "/").apply {
                response.status() shouldBe HttpStatusCode.OK
                response.content shouldBe "Hello World!"
            }
        }
    }
}
