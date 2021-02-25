package eu.yeger.finwa.model.api

import kotlinx.serialization.Serializable

@Serializable
public data class ApiToken(val jwt: String, val expiration: Long)
