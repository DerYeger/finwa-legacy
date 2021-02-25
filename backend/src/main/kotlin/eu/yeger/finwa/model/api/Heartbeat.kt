package eu.yeger.finwa.model.api

import kotlinx.serialization.Serializable

@Serializable
public data class HeartbeatRequest(
    val url: String
)

@Serializable
public data class HeartbeatResponse(
    val message: String,
    val url: String
)
