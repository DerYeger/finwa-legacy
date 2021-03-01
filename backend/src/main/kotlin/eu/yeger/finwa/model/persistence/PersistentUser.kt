package eu.yeger.finwa.model.persistence

import eu.yeger.finwa.model.domain.User
import kotlinx.serialization.Serializable

@Serializable
public data class PersistentUser(
    override val id: String,
    val name: String,
    val password: String
) : Entity

public fun PersistentUser.toUser(): User =
    User(
        id = id,
        name = name,
        password = password
    )
