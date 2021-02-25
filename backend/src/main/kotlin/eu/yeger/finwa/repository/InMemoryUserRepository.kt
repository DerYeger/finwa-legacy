package eu.yeger.finwa.repository

import eu.yeger.finwa.model.persistence.PersistentUser

public class InMemoryUserRepository : UserRepository, Repository<PersistentUser> by InMemoryRepository()
