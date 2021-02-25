package eu.yeger.finwa.koin

import io.ktor.application.*
import org.koin.ktor.ext.Koin

public fun Application.koinModule() {
    install(Koin) {
        modules(serviceModule + repositoryModule + databaseModule)
    }
}
