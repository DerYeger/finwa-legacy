package eu.yeger.finwa.model.api

import kotlinx.serialization.Serializable

@Serializable
public data class ApiUser(
    val id: String,
    val name: String
)
