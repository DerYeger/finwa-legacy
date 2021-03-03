package eu.yeger.finwa.repository.user

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.mapBoth
import eu.yeger.finwa.model.api.IntermediateResult
import eu.yeger.finwa.model.api.TranslationDTO
import eu.yeger.finwa.model.api.conflict
import eu.yeger.finwa.model.api.notFound
import eu.yeger.finwa.model.persistence.PersistentUser
import eu.yeger.finwa.repository.Repository

public interface UserRepository : Repository<PersistentUser> {

  public suspend fun getByName(name: String): PersistentUser?

  public suspend fun validateUserWithIdExists(userId: String): IntermediateResult<PersistentUser> {
    return when (val user = getById(userId)) {
      null -> Err(notFound(TranslationDTO("api.error.user.not-found")))
      else -> Ok(user)
    }
  }

  public suspend fun validateUserWithNameExists(userName: String): IntermediateResult<PersistentUser> {
    return when (val user = getByName(userName)) {
      null -> Err(notFound(TranslationDTO("api.error.user.not-found")))
      else -> Ok(user)
    }
  }

  public suspend fun validateUserIdIsAvailable(userId: String): IntermediateResult<Unit> {
    return validateUserWithIdExists(userId)
      .mapBoth(
        success = { Err(conflict(TranslationDTO("api.error.user.id-taken"))) },
        failure = { Ok(Unit) }
      )
  }

  public suspend fun validateUserNameIsAvailable(userName: String): IntermediateResult<Unit> {
    return validateUserWithNameExists(userName)
      .mapBoth(
        success = { Err(conflict(TranslationDTO("api.error.user.name-taken"))) },
        failure = { Ok(Unit) }
      )
  }
}
