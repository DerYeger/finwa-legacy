package eu.yeger.finwa.model.persistence

import eu.yeger.finwa.model.domain.User

public data class PersistentUser(
    val name: String,
    val password: String
) : Entity {
    override val id: String = name
}

public fun PersistentUser.toUser(): User =
    User(
        name = name,
        password = password
    )
