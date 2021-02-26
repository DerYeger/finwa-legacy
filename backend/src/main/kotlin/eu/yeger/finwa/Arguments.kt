package eu.yeger.finwa

import com.apurebase.arkenv.Arkenv
import com.apurebase.arkenv.argument

public object Arguments : Arkenv() {
    public val url: String by argument {
        defaultValue = { "localhost" }
    }

    public val defaultUsername: String by argument {
        defaultValue = { "finwa" }
    }

    public val defaultPassword: String by argument {
        defaultValue = { "finwa" }
    }

    public val databaseHost: String? by argument()
    public val databasePort: String? by argument()
    public val databaseName: String? by argument()
}

public val Arguments.useDatabase: Boolean
    get() = databaseHost != null && databasePort != null && databaseName != null
