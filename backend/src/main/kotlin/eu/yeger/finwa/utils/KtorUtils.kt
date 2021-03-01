package eu.yeger.finwa.utils

import eu.yeger.finwa.model.api.ApiResult
import eu.yeger.finwa.model.api.respondWithResult
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.routing.*
import io.ktor.util.pipeline.*

@ContextDsl
public inline fun <reified T : Any> Route.get(
    crossinline body: suspend PipelineContext<Unit, ApplicationCall>.() -> ApiResult<T>
): Route {
    return get("") {
        respondWithResult(body())
    }
}

@ContextDsl
public inline fun <reified R : Any, reified T : Any> Route.post(
    crossinline body: suspend PipelineContext<Unit, ApplicationCall>.(R) -> ApiResult<T>
): Route {
    return post<R>("") { received ->
        respondWithResult(body(received))
    }
}

@ContextDsl
public inline fun <reified T : Any> Route.delete(
    crossinline body: suspend PipelineContext<Unit, ApplicationCall>.() -> ApiResult<T>
): Route {
    return delete("") {
        respondWithResult(body())
    }
}

public fun PipelineContext<Unit, ApplicationCall>.getParameter(name: String): String {
    return call.parameters[name] ?: throw BadRequestException("")
}
