package eu.yeger.finwa.repository

import eu.yeger.finwa.model.persistence.PersistentUser
import org.litote.kmongo.coroutine.CoroutineCollection

public class MongoUserRepository(
    userCollection: CoroutineCollection<PersistentUser>
) : UserRepository, Repository<PersistentUser> by MongoRepository(userCollection)
