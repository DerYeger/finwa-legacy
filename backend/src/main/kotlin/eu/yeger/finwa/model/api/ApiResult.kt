package eu.yeger.finwa.model.api

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.util.pipeline.*

public typealias ApiResult<T> = Result<ResponseEntity<T>, ResponseEntity<TranslationDTO>>

public suspend inline fun <reified T : Any> PipelineContext<Unit, ApplicationCall>.respondWithResult(result: ApiResult<T>) {
    when (result) {
        is Ok<ResponseEntity<T>> -> call.respond(result.value.status, result.value.data)
        is Err<ResponseEntity<TranslationDTO>> -> call.respond(result.error.status, mapOf("message" to result.error.data))
    }
}
