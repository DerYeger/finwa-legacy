package eu.yeger.finwa

import com.apurebase.arkenv.Arkenv
import com.apurebase.arkenv.argument

public object Arguments : Arkenv() {
    public val domain: String by argument()
}
