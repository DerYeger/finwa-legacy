package eu.yeger.finwa.repository.user

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import eu.yeger.finwa.model.api.IntermediateResult
import eu.yeger.finwa.model.api.TranslationDTO
import eu.yeger.finwa.model.api.notFound
import eu.yeger.finwa.model.persistence.PersistentUser
import eu.yeger.finwa.repository.Repository

public interface UserRepository : Repository<PersistentUser> {

    public suspend fun getByName(name: String): PersistentUser?

    public suspend fun validateUserWithIdExists(userId: String): IntermediateResult<PersistentUser> {
        return when (val user = getById(userId)) {
            null -> Err(notFound(TranslationDTO("user.not-found")))
            else -> Ok(user)
        }
    }

    public suspend fun validateUserWithNameExists(userName: String): IntermediateResult<PersistentUser> {
        return when (val user = getByName(userName)) {
            null -> Err(notFound(TranslationDTO("user.not-found")))
            else -> Ok(user)
        }
    }
}
