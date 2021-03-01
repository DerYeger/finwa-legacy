package eu.yeger.finwa.model.domain

import eu.yeger.finwa.model.api.ApiUser
import eu.yeger.finwa.model.persistence.PersistentUser
import java.util.*

public data class User(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val password: String
)

public fun User.toPersistentUser(): PersistentUser =
    PersistentUser(
        id = id,
        name = name,
        password = password
    )

public fun User.toApiUser(): ApiUser =
    ApiUser(
        id = id,
        name = name
    )
