package eu.yeger.finwa.repository.user

import eu.yeger.finwa.model.persistence.PersistentUser
import eu.yeger.finwa.repository.MongoRepository
import eu.yeger.finwa.repository.Repository
import org.litote.kmongo.coroutine.CoroutineCollection
import org.litote.kmongo.eq

public class MongoUserRepository(
    private val userCollection: CoroutineCollection<PersistentUser>
) : UserRepository, Repository<PersistentUser> by MongoRepository(userCollection) {

    override suspend fun getByName(name: String): PersistentUser? {
        return userCollection.findOne(PersistentUser::name eq name)
    }
}
