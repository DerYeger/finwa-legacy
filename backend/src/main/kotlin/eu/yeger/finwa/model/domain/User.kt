package eu.yeger.finwa.model.domain

import eu.yeger.finwa.model.persistence.PersistentUser

public data class User(
    val name: String,
    val password: String
)

public fun User.toPersistentUser(): PersistentUser =
    PersistentUser(
        name = name,
        password = password
    )
