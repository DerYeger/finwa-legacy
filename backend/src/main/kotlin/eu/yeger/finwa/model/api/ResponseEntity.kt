package eu.yeger.finwa.model.api

import io.ktor.http.*

public data class ResponseEntity<T>(val status: HttpStatusCode, val data: T)

public fun notFound(translationDTO: TranslationDTO): ResponseEntity<TranslationDTO> =
    ResponseEntity(HttpStatusCode.UnprocessableEntity, translationDTO)

public fun unauthorized(translationDTO: TranslationDTO): ResponseEntity<TranslationDTO> =
    ResponseEntity(HttpStatusCode.Unauthorized, translationDTO)
