package eu.yeger.finwa.repository

import eu.yeger.finwa.model.persistence.Entity
import eu.yeger.finwa.utils.upsert
import org.litote.kmongo.coroutine.CoroutineCollection

public class MongoRepository<T : Entity>(private val entityCollection: CoroutineCollection<T>) : Repository<T> {

  public override suspend fun getAll(): List<T> {
    return entityCollection.find().toList()
  }

  public override suspend fun getById(id: String): T? {
    return entityCollection.findOneById(id)
  }

  public override suspend fun isEmpty(): Boolean {
    return entityCollection.countDocuments() == 0L
  }

  public override suspend fun save(entity: T) {
    entityCollection.upsert(entity)
  }

  override suspend fun deleteById(id: String): Boolean {
    return entityCollection.deleteOneById(id).deletedCount == 1L
  }
}
