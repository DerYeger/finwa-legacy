package eu.yeger.finwa.koin

import eu.yeger.finwa.Arguments
import eu.yeger.finwa.repository.InMemoryUserRepository
import eu.yeger.finwa.repository.MongoUserRepository
import eu.yeger.finwa.repository.UserRepository
import eu.yeger.finwa.useDatabase
import mu.KotlinLogging
import org.koin.core.module.Module
import org.koin.dsl.module
import org.litote.kmongo.coroutine.CoroutineDatabase

private val logger = KotlinLogging.logger { }

public val repositoryModule: Module = when (Arguments.useDatabase) {
    true -> module {
        logger.info { "Using MongoDB-repositories" }

        single<UserRepository> {
            MongoUserRepository(get<CoroutineDatabase>().getCollection())
        }
    }
    false -> module {
        logger.info { "Falling back to in-memory-repositories" }

        single<UserRepository> {
            InMemoryUserRepository()
        }
    }
}
