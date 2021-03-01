package eu.yeger.finwa

import eu.yeger.finwa.auth.authModule
import eu.yeger.finwa.koin.koinModule
import eu.yeger.finwa.model.api.HeartbeatRequest
import eu.yeger.finwa.model.api.HeartbeatResponse
import eu.yeger.finwa.monitoring.monitoringModule
import eu.yeger.finwa.routing.routingModule
import io.kotest.matchers.shouldBe
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
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
            handleRequest {
                method = HttpMethod.Post
                uri = "/heartbeat"
                addHeader("Content-Type", "application/json")
                setBody(Json.encodeToString(HeartbeatRequest("test.domain.org")))
            }.run {
                response.status() shouldBe HttpStatusCode.OK
                Json.decodeFromString<HeartbeatResponse>(response.content!!) shouldBe HeartbeatResponse(message = "FinWa-Backend", url = "test.domain.org")
            }
        }
    }

    @Test
    fun `verify that api routes are secured when authentication is configured`() {
        withTestApplication({
            mainModule()
            authModule()
            koinModule()
            routingModule()
        }) {
            handleRequest(method = HttpMethod.Get, uri = "/api/users").run {
                response.status() shouldBe HttpStatusCode.Unauthorized
            }
        }
    }

    @Test
    fun `verify that api routes are not secured when authentication is not configured`() {
        withTestApplication({
            mainModule()
            koinModule()
            routingModule()
        }) {
            handleRequest(method = HttpMethod.Get, uri = "/api/users").run {
                response.status() shouldBe HttpStatusCode.OK
            }
        }
    }
}
