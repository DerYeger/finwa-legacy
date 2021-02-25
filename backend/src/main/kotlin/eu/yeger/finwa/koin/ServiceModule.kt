package eu.yeger.finwa.koin

import eu.yeger.finwa.service.UserService
import org.koin.core.module.Module
import org.koin.dsl.module

public val serviceModule: Module = module {
    single {
        UserService(get())
    }
}
