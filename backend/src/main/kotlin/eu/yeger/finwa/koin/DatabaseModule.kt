package eu.yeger.finwa.koin

import eu.yeger.finwa.Arguments
import mu.KotlinLogging
import org.koin.core.module.Module
import org.koin.dsl.module
import org.litote.kmongo.coroutine.coroutine
import org.litote.kmongo.reactivestreams.KMongo

public val databaseModule: Module = module {
  val logger = KotlinLogging.logger { }

  single {
    val host = Arguments.databaseHost
    val port = Arguments.databasePort
    val name = Arguments.databaseName
    if (host == null || port == null || name == null) {
      logger.info { "Incomplete database configuration, aborting connection" }
      return@single null
    }

//        val mongoLogger: Logger = Logger.getLogger("org.mongodb.driver.cluster")
//        mongoLogger.level = Level.SEVERE
    KMongo
      .createClient("mongodb://$host:$port")
      .coroutine
      .getDatabase(name)
  }
}
