package eu.yeger.finwa.auth

import eu.yeger.finwa.model.api.Credentials
import eu.yeger.finwa.model.domain.User
import org.mindrot.jbcrypt.BCrypt

public fun User.withHashedPassword(): User {
    return this.copy(password = BCrypt.hashpw(password, BCrypt.gensalt()))
}

public infix fun Credentials.matches(user: User): Boolean {
    return this.username == user.name &&
        BCrypt.checkpw(this.password, user.password)
}
