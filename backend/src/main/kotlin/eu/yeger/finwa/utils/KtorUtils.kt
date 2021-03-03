package eu.yeger.finwa.utils

import eu.yeger.finwa.model.api.ApiResult
import eu.yeger.finwa.model.api.respondWithResult
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.request.*
import io.ktor.routing.*
import io.ktor.util.pipeline.*
import io.ktor.routing.delete as ktorDelete
import io.ktor.routing.get as ktorGet
import io.ktor.routing.post as ktorPost
import io.ktor.routing.put as ktorPut

@ContextDsl
public inline fun <reified T : Any> Route.get(
  path: String = "",
  crossinline body: suspend PipelineContext<Unit, ApplicationCall>.() -> ApiResult<T>
): Route {
  return ktorGet(path) {
    respondWithResult(body())
  }
}

@ContextDsl
public inline fun <reified R : Any, reified T : Any> Route.post(
  path: String = "",
  crossinline body: suspend PipelineContext<Unit, ApplicationCall>.(R) -> ApiResult<T>
): Route {
  return ktorPost<R>(path) { received ->
    respondWithResult(body(received))
  }
}

@ContextDsl
public inline fun <reified R : Any, reified T : Any> Route.put(
  path: String = "",
  crossinline body: suspend PipelineContext<Unit, ApplicationCall>.(R) -> ApiResult<T>
): Route {
  return ktorPut(path) {
    respondWithResult(body(call.receive()))
  }
}

@ContextDsl
public inline fun <reified T : Any> Route.delete(
  path: String = "",
  crossinline body: suspend PipelineContext<Unit, ApplicationCall>.() -> ApiResult<T>
): Route {
  return ktorDelete(path) {
    respondWithResult(body())
  }
}

public fun PipelineContext<Unit, ApplicationCall>.getParameter(name: String): String {
  return call.parameters[name] ?: throw BadRequestException("")
}
