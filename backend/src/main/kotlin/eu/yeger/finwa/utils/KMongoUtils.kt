package eu.yeger.finwa.utils

import com.mongodb.client.model.UpdateOptions
import com.mongodb.client.result.UpdateResult
import eu.yeger.finwa.model.persistence.Entity
import org.bson.conversions.Bson
import org.litote.kmongo.coroutine.CoroutineCollection
import org.litote.kmongo.eq

public suspend fun <T : Entity> CoroutineCollection<T>.upsert(
  entity: T,
  options: UpdateOptions = UpdateOptions()
): UpdateResult =
  updateOneById(
    id = entity.id,
    update = entity,
    options = options.upsert(true)
  )

public suspend fun <T : Entity> CoroutineCollection<T>.updateById(id: String, update: Bson): T? =
  findOneAndUpdate(filter = Entity::id eq id, update)
