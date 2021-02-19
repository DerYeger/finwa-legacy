package eu.yeger.finwa.locations

import io.ktor.application.*
import io.ktor.locations.*
import io.ktor.response.*
import io.ktor.routing.*

public fun Application.locationsModule() {
    install(Locations)

    routing {
        get<MyLocation> {
            call.respondText("Location: name=${it.name}, arg1=${it.arg1}, arg2=${it.arg2}")
        }
        // Register nested routes
        get<Type.Edit> {
            call.respondText("Inside $it")
        }
        get<Type.List> {
            call.respondText("Inside $it")
        }
    }
}

@Location("/location/{name}")
public class MyLocation(public val name: String, public val arg1: Int = 42, public val arg2: String = "default")

@Location("/type/{name}")
public data class Type(val name: String) {
    @Location("/edit")
    public data class Edit(val type: Type)

    @Location("/list/{page}")
    public data class List(val type: Type, val page: Int)
}
