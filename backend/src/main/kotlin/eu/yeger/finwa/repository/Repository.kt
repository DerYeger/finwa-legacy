package eu.yeger.finwa.repository

import eu.yeger.finwa.model.persistence.Entity

public interface Repository<T : Entity> {

    public suspend fun getAll(): List<T>

    public suspend fun getById(id: String): T?

    public suspend fun isEmpty(): Boolean

    public suspend fun save(entity: T)
}
