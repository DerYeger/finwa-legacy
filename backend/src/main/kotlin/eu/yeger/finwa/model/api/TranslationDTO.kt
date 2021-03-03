package eu.yeger.finwa.model.api

import kotlinx.serialization.Serializable

@Serializable
public data class TranslationDTO(
  val key: String,
  val params: Map<String, String>? = null
) {
  public constructor(key: String, vararg params: Pair<String, String>) : this(key, mapOf(*params).takeUnless { it.isEmpty() })
}
