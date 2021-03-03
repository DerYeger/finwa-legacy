package eu.yeger.finwa.routing

import eu.yeger.finwa.model.domain.User
import eu.yeger.finwa.service.UserService
import eu.yeger.finwa.utils.delete
import eu.yeger.finwa.utils.get
import eu.yeger.finwa.utils.getParameter
import eu.yeger.finwa.utils.post
import io.ktor.routing.*
import org.koin.ktor.ext.inject

public fun Route.userRoutes() {
  val userService: UserService by inject()

  get { userService.getAll() }

  post { user: User -> userService.create(user) }

  route("/{id}") {
    get {
      userService.getById(getParameter("id"))
    }

    delete {
      userService.deleteById(getParameter("id"))
    }
  }
}
