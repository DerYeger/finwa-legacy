package eu.yeger.finwa.utils

import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result

public fun <T : Any, V> T.toResult(): Result<T, V> = Ok(this)

public fun <T : Any, U : Any, V> T.toResult(transform: (T) -> U): Result<U, V> = Ok(transform(this))

public fun <T, U> Result<T, U>.vanish(): Result<Unit, U> = Ok(Unit)
