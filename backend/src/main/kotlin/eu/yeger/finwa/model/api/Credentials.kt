package eu.yeger.finwa.model.api

import kotlinx.serialization.Serializable

@Serializable
public data class Credentials(
    val name: String,
    val password: String
)
