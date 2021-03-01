package eu.yeger.finwa.repository.user

import eu.yeger.finwa.model.persistence.PersistentUser
import eu.yeger.finwa.repository.InMemoryRepository
import eu.yeger.finwa.repository.Repository
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentMap

public class InMemoryUserRepository(
    private val userMap: ConcurrentMap<String, PersistentUser> = ConcurrentHashMap()
) : UserRepository, Repository<PersistentUser> by InMemoryRepository(userMap) {

    override suspend fun getByName(name: String): PersistentUser? {
        return userMap.values.find { it.name == name }
    }
}
