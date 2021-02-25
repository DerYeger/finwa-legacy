package eu.yeger.finwa

import eu.yeger.finwa.auth.authModule
import eu.yeger.finwa.koin.koinModule
import eu.yeger.finwa.monitoring.monitoringModule
import eu.yeger.finwa.routing.routingModule
import io.kotest.matchers.shouldBe
import io.ktor.http.*
import io.ktor.server.testing.*
import org.junit.jupiter.api.Test

class ApplicationTest {

    @Test
    fun testRoot() {
        withTestApplication({
            mainModule()
            authModule()
            koinModule()
            monitoringModule()
            routingModule()
            initializationModule()
        }) {
            handleRequest(HttpMethod.Get, "/heartbeat").apply {
                response.status() shouldBe HttpStatusCode.OK
                response.content shouldBe "FinWa-Backend"
            }
        }
    }
}
