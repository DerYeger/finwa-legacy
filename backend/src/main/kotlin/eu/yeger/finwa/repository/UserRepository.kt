package eu.yeger.finwa.repository

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import eu.yeger.finwa.model.api.ApiResult
import eu.yeger.finwa.model.api.TranslationDTO
import eu.yeger.finwa.model.api.notFound
import eu.yeger.finwa.model.persistence.PersistentUser

public interface UserRepository : Repository<PersistentUser> {

    public suspend fun validateUserExists(userId: String): ApiResult<PersistentUser> {
        return when (val user = getById(id = userId)) {
            null -> Err(notFound(TranslationDTO("user.not-found")))
            else -> Ok(user)
        }
    }
}
