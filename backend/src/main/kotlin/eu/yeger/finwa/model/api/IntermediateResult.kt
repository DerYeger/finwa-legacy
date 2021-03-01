package eu.yeger.finwa.model.api

import com.github.michaelbull.result.Result

public typealias IntermediateResult<T> = Result<T, ResponseEntity<TranslationDTO>>
