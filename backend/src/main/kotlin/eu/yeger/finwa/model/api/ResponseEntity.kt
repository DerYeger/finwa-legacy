package eu.yeger.finwa.model.api

import io.ktor.http.*

public data class ResponseEntity<T : Any>(val status: HttpStatusCode, val data: T)

public fun <T : Any> ok(data: T): ResponseEntity<T> =
    ResponseEntity(HttpStatusCode.OK, data)

public fun notFound(translationDTO: TranslationDTO): ResponseEntity<TranslationDTO> =
    ResponseEntity(HttpStatusCode.UnprocessableEntity, translationDTO)

public fun unauthorized(translationDTO: TranslationDTO): ResponseEntity<TranslationDTO> =
    ResponseEntity(HttpStatusCode.Unauthorized, translationDTO)
