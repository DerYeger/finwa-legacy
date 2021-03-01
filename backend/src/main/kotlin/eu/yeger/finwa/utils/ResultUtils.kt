package eu.yeger.finwa.utils

import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result

public fun <T : Any, U> T.toResult(): Result<T, U> = Ok(this)
