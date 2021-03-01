package eu.yeger.finwa.routing

import io.ktor.routing.*

public fun Route.apiRoutes() {
    route("api") {
        route("users", Route::userRoutes)
    }
}
