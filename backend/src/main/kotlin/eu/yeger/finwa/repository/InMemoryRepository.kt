package eu.yeger.finwa.repository

import eu.yeger.finwa.model.persistence.Entity
import java.util.concurrent.ConcurrentHashMap

public class InMemoryRepository<T : Entity> : Repository<T> {
    private val entityMap = ConcurrentHashMap<String, T>()

    override suspend fun getAll(): List<T> {
        return entityMap.values.toList()
    }

    override suspend fun getById(id: String): T? {
        return entityMap[id]
    }

    override suspend fun isEmpty(): Boolean {
        return entityMap.isEmpty()
    }

    override suspend fun save(entity: T) {
        entityMap[entity.id] = entity
    }
}
