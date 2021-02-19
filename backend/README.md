# finwa-backend

finwa-backend is your new project powered by [Ktor](http://ktor.io) framework.

<img src="https://repository-images.githubusercontent.com/40136600/f3f5fd00-c59e-11e9-8284-cb297d193133" alt="Ktor" width="100" style="max-width:20%;">

Company website: yeger.eu Ktor Version: 1.5.1 Kotlin Version: 1.4.10
BuildSystem: [Gradle with Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)

# Ktor Documentation

Ktor is a framework for quickly creating web applications in Kotlin with minimal effort.

* Ktor project's [Github](https://github.com/ktorio/ktor/blob/master/README.md)
* Getting started with [Gradle](http://ktor.io/quickstart/gradle.html)
* Getting started with [Maven](http://ktor.io/quickstart/maven.html)
* Getting started with [IDEA](http://ktor.io/quickstart/intellij-idea.html)

Selected Features:

* [Routing](#routing-documentation-jetbrainshttpswwwjetbrainscom)
* [Authentication](#authentication-documentation-jetbrainshttpswwwjetbrainscom)
* [CallLogging](#calllogging-documentation-jetbrainshttpswwwjetbrainscom)
* [CORS](#cors-documentation-jetbrainshttpswwwjetbrainscom)
* [DefaultHeaders](#defaultheaders-documentation-jetbrainshttpswwwjetbrainscom)
* [Locations](#locations-documentation-jetbrainshttpswwwjetbrainscom)
* [Status Pages](#status-pages-documentation-jetbrainshttpswwwjetbrainscom)
* [ContentNegotiation](#contentnegotiation-documentation-jetbrainshttpswwwjetbrainscom)
* [kotlinx.serialization](#kotlinx.serialization-documentation-jetbrainshttpswwwjetbrainscom)
* [Micrometer Metrics](#micrometer-metrics-documentation-jetbrainshttpswwwjetbrainscom)
* [Authentication Basic](#authentication-basic-documentation-jetbrainshttpswwwjetbrainscom)
* [Authentication JWT](#authentication-jwt-documentation-jetbrainshttpswwwjetbrainscom)

## Routing Documentation ([JetBrains](https://www.jetbrains.com))

Allows to define structured routes and associated handlers.

### Description

Routing is a feature that is installed into an Application to simplify and structure page request handling. This page
explains the routing feature. Extracting information about a request, and generating valid responses inside a route, is
described on the requests and responses pages.

```application.install(Routing) {
    get("/") {
        call.respondText("Hello, World!")
    }
    get("/bye") {
        call.respondText("Good bye, World!")
    }

```

`get`, `post`, `put`, `delete`, `head` and `options` functions are convenience shortcuts to a flexible and powerful
routing system. In particular, get is an alias to `route(HttpMethod.Get, path) { handle(body) }`, where body is a lambda
passed to the get function.

### Usage

## Routing Tree

Routing is organized in a tree with a recursive matching system that is capable of handling quite complex rules for
request processing. The Tree is built with nodes and selectors. The Node contains handlers and interceptors, and the
selector is attached to an arc which connects another node. If selector matches current routing evaluation context, the
algorithm goes down to the node associated with that selector.

Routing is built using a DSL in a nested manner:

```
route("a") { // matches first segment with the value "a"
  route("b") { // matches second segment with the value "b"
     get {…} // matches GET verb, and installs a handler
     post {…} // matches POST verb, and installs a handler
  }
}
```

```
method(HttpMethod.Get) { // matches GET verb
   route("a") { // matches first segment with the value "a"
      route("b") { // matches second segment with the value "b"
         handle { … } // installs handler
      }
   }
}
```

Route resolution algorithms go through nodes recursively discarding subtrees where selector didn't match.

Builder functions:

* `route(path)` – adds path segments matcher(s), see below about paths
* `method(verb)` – adds HTTP method matcher.
* `param(name, value)` – adds matcher for a specific value of the query parameter
* `param(name)` – adds matcher that checks for the existence of a query parameter and captures its value
* `optionalParam(name)` – adds matcher that captures the value of a query parameter if it exists
* `header(name, value)` – adds matcher that for a specific value of HTTP header, see below about quality

## Path

Building routing tree by hand would be very inconvenient. Thus there is `route` function that covers most of the use
cases in a simple way, using path.

`route` function (and respective HTTP verb aliases) receives a `path` as a parameter which is processed to build routing
tree. First, it is split into path segments by the `/` delimiter. Each segment generates a nested routing node.

These two variants are equivalent:

```
route("/foo/bar") { … } // (1)

route("/foo") {
   route("bar") { … } // (2)
}
```

### Parameters

Path can also contain parameters that match specific path segment and capture its value into `parameters` properties of
an application call:

```
get("/user/{login}") {
   val login = call.parameters["login"]
}
```

When user agent requests `/user/john` using `GET` method, this route is matched and `parameters` property will
have `"login"` key with value `"john"`.

### Optional, Wildcard, Tailcard

Parameters and path segments can be optional or capture entire remainder of URI.

* `{param?}` –- optional path segment, if it exists it's captured in the parameter
* `*` –- wildcard, any segment will match, but shouldn't be missing
* `{...}` –- tailcard, matches all the rest of the URI, should be last. Can be empty.
* `{param...}` –- captured tailcard, matches all the rest of the URI and puts multiple values for each path segment
  into `parameters` using `param` as key. Use `call.parameters.getAll("param")` to get all values.

Examples:

```
get("/user/{login}/{fullname?}") { … }
get("/resources/{path...}") { … }
```

## Quality

It is not unlikely that several routes can match to the same HTTP request.

One example is matching on the `Accept` HTTP header which can have multiple values with specified priority (quality).

```
accept(ContentType.Text.Plain) { … }
accept(ContentType.Text.Html) { … }
```

The routing matching algorithm not only checks if a particular HTTP request matches a specific path in a routing tree,
but it also calculates the quality of the match and selects the routing node with the best quality. Given the routes
above, which match on the Accept header, and given the request header `Accept: text/plain; q=0.5, text/html` will
match `text/html` because the quality factor in the HTTP header indicates a lower quality fortext/plain (default is 1.0)
.

The Header `Accept: text/plain, text/*` will match `text/plain`. Wildcard matches are considered less specific than
direct matches. Therefore the routing matching algorithm will consider them to have a lower quality.

Another example is making short URLs to named entities, e.g. users, and still being able to prefer specific pages
like `"settings"`. An example would be

* `https://twitter.com/kotlin` -– displays user `"kotlin"`
* `https://twitter.com/settings` -- displays settings page

This can be implemented like this:

```
get("/{user}") { … }
get("/settings") { … }
```

The parameter is considered to have a lower quality than a constant string, so that even if `/settings` matches both,
the second route will be selected.

### Options

No options()

## Authentication Documentation ([JetBrains](https://www.jetbrains.com))

Handle Basic and Digest HTTP Auth, Form authentication and OAuth 1a and 2

### Description

Ktor supports authentication out of the box as a standard pluggable feature. It supports mechanisms to read credentials,
and to authenticate principals. It can be used in some cases along with the sessions feature to keep the login
information between requests.

### Usage

## Basic usage

Ktor defines two concepts: credentials and principals. A principal is something that can be authenticated: a user, a
computer, a group, etc. A credential is an object that represents a set of properties for the server to authenticate a
principal: a `user/password`, an API key or an authenticated payload signature, etc. To install it, you have to call
to `application.install(Authentication)`. You have to install this feature directly to the application and it won't work
in another `ApplicationCallPipeline` like `Route`. You might still be able to call the install code inside a Route if
you have the `Application` injected in a nested DSL, but it will be applied to the application itself. Using its DSL, it
allows you to configure the authentication providers available:

```
install(Authentication) {
    basic(name = "myauth1") {
        realm = "Ktor Server"
        validate { credentials ->
            if (credentials.name == credentials.password) {
                UserIdPrincipal(credentials.name)
            } else {
                null
            }
        }
    }
}

```

After defining one or more authentication providers (named or unnamed), with the routing feature you can create a route
group, that will apply that authentication to all the routes defined in that group:

```
routing {
    authenticate("myauth1") {
        get("/authenticated/route1") {
            // ...
        }
        get("/other/route2") {
            // ...
        }
    }
    get("/") {
        // ...
    }
}

```

You can specify several names to apply several authentication providers, or none or null to use the unnamed one. You can
get the generated Principal instance inside your handler with:

```
val principal: UserIdPrincipal? = call.authentication.principal<UserIdPrincipal>()

```

In the generic, you have to put a specific type that must match the generated Principal. It will return null in the case
you provide another type. The handler won't be executed if the configured authentication fails (when returning null in
the authentication mechanism)

## Naming the AuthenticationProvider

It is possible to give arbitrary names to the authentication providers you specify, or to not provide a name at all (
unnamed provider) by not setting the name argument or passing a null. You cannot repeat authentication provider names,
and you can define just one provider without a name. In the case you repeat a name for the provider or try to define two
unnamed providers, an exception will be thrown:

```
java.lang.IllegalArgumentException: Provider with the name `authName` is already registered
```

Summarizing:

```
install(Authentication) {
    basic { // Unamed `basic` provider
        // ...
    }
    form { // Unamed `form` provider (exception, already defined a provider with name = null)
        // ...
    }
    basic("name1") { // "name1" provider
        // ...
    }
    basic("name1") { // "name1" provider (exception, already defined a provider with name = "name1")
        // ...
    }
}

```

## Skipping/Omitting Authentication providers

You can also skip an authentication based on a criteria.

```
/**
 * Authentication filters specifying if authentication is required for particular [ApplicationCall]
 * If there is no filters, authentication is required. If any filter returns true, authentication is not required.
 */
fun AuthenticationProvider.skipWhen(predicate: (ApplicationCall) -> Boolean)

```

For example, to skip a basic authentication if there is already a session, you could write:

```
authentication {
    basic {
        skipWhen { call -> call.sessions.get<UserSession>() != null }
    }
}

```

### Options

No options()

## CallLogging Documentation ([JetBrains](https://www.jetbrains.com))

Logs client requests

### Description

You might want to log client requests: and the Call Logging feature does just that. It uses
the `ApplicationEnvironment.log(LoggerFactory.getLogger("Application"))` that uses `slf4j` so you can easily configure
the output. For more information on logging in Ktor, please check the logging in the ktor page.

### Usage

## Basic usage

The basic unconfigured feature logs every request using the level `TRACE`:

```
install(CallLogging)

```

## Configuring

This feature allows you to configure the log level and filtering the requests that are being logged:

```
install(CallLogging) {
    level = Level.INFO
    filter { call -> call.request.path().startsWith("/section1") }
    filter { call -> call.request.path().startsWith("/section2") }
    // ...
}

```

The filter method keeps an allow list of filters. If no filters are defined, everything is logged. And if there are
filters, if any of them returns true, the call will be logged.

In the example, it will log both: `/section1/*` and `/section2/*` requests.

## MDC

The `CallLogging` feature supports `MDC` (Mapped Diagnostic Context) from `slf4j` to associate information as part of
the request.

When installing the `CallLogging`, you can configure a parameter to associate to the request with the mdc method. This
method requires a key name, and a function provider. The context would be associated (and the providers will be called)
as part of the `Monitoring` pipeline phase.

```
install(CallLogging) {
    mdc(name) { // call: ApplicationCall ->
        "value"
    }
    // ...
}

```

### Options

No options()

## CORS Documentation ([JetBrains](https://www.jetbrains.com))

Enable Cross-Origin Resource Sharing (CORS)

### Description

Ktor by default provides an interceptor for implementing proper support for Cross-Origin Resource Sharing (`CORS`).

### Usage

## Basic usage:

First of all, install the `CORS` feature into your application.

```
fun Application.main() {
  ...
  install(CORS)
  ...
}
```

The default configuration to the CORS feature handles only `GET`, `POST` and `HEAD` HTTP methods and the following
headers:

```
HttpHeaders.Accept
HttpHeaders.AcceptLanguages
HttpHeaders.ContentLanguage
HttpHeaders.ContentType
```

## Advanced usage:

Here is an advanced example that demonstrates most of CORS-related API functions

```
fun Application.main() {
  ...
  install(CORS)
  {
    method(HttpMethod.Options)
    header(HttpHeaders.XForwardedProto)
    anyHost()
    host("my-host")
    // host("my-host:80")
    // host("my-host", subDomains = listOf("www"))
    // host("my-host", schemes = listOf("http", "https"))
    allowCredentials = true
    allowNonSimpleContentTypes = true
    maxAge = Duration.ofDays(1)
  }
  ...
}
```

### Options

* `method("HTTP_METHOD")` : Includes this method to the white list of Http methods to use CORS.
* `header("header-name")` : Includes this header to the white list of headers to use CORS.
* `exposeHeader("header-name")` : Exposes this header in the response.
* `exposeXHttpMethodOverride()` : Exposes `X-Http-Method-Override` header in the response
* `anyHost()` : Allows any host to access the resources
* `host("hostname")` : Allows only the specified host to use `CORS`, it can have the port number, a list of subDomains
  or the supported schemes.
* `allowCredentials` : Includes `Access-Control-Allow-Credentials` header in the response
* `allowNonSimpleContentTypes`: Inclues `Content-Type` request header to the white list for values other than simple
  content types.
* `maxAge`: Includes `Access-Control-Max-Age` header in the response with the given max age()

## DefaultHeaders Documentation ([JetBrains](https://www.jetbrains.com))

This feature adds a default set of headers to HTTP responses

### Description

The `DefaultHeaders` feature adds the standard `Server` and `Date` headers into each response. Moreover, you can provide
additional default headers and override the `Server` header.

### Usage

## Installation

To install the `DefaultHeaders` feature, pass it to the `install` function in the application initialization code. This
can be the `main` function ...

```
import io.ktor.features.*
// ...
fun Application.main() {
  install(DefaultHeaders)
  // ...
}
```

... or a specified `module`:

```
import io.ktor.features.*
// ...
fun Application.module() {
    install(DefaultHeaders)
    // ...
}
```

The `DefaultHeaders` feature adds the `Server` and `Date` headers into each response. If necessary, you can override
the `Server`, as described in `Override Headers` section.

## Add Additional Headers

To customize a list of default headers, pass a desired header to `install` by using the `header(name, value)` function.
The name parameter accepts an `HttpHeaders` value, for example:

```
install(DefaultHeaders) {
    header(HttpHeaders.ETag, "7c876b7e")
}
```

To add a custom header, pass its name as a string value:

```
install(DefaultHeaders) {
    header("Custom-Header", "Some value")
}
```

## Override Headers

To override the `Server` header, use a corresponding `HttpHeaders` value:

```
install(DefaultHeaders) {
    header(HttpHeaders.Server, "Custom")
}
```

Note that the `Date` header is cached due to performance reasons and cannot be overridden by using `DefaultHeaders`. If
you need to override it, do not install the `DefaultHeaders` feature and use route interception instead.

## Customize Headers for Specific Routes

If you need to add headers for a specific route only, you can append desired headers into a response. The code snippet
below shows how to do this for the `/order` request:

```
get("/order") {
    call.response.headers.append(HttpHeaders.ETag, "7c876b7e")
}
```

You can learn more about routing in Ktor
from [Routing in Ktor](https://helpserver.labs.jb.gg/help/ktor/1.5.1/routing-in-ktor.html).

### Options

* `header` -- specify default value for the given header()

## Locations Documentation ([JetBrains](https://www.jetbrains.com))

Allows to define route locations in a typed way

### Description

Ktor provides a mechanism to create routes in a typed way, for both: constructing URLs and reading the parameters.

### Usage

## Installation

The Locations feature doesn't require any special configuration:

```
install(Locations)
```

## Defining route classes

For each typed route you want to handle, you need to create a class (usually a data class) containing the parameters
that you want to handle.

The parameters must be of any type supported by the `Data Conversion` feature. By default, you can use `Int`, `Long`
, `Float`, `Double`, `Boolean`, `String`, enums and `Iterable` as parameters.

### URL parameters

That class must be annotated with `@Location` specifying a path to match with placeholders between curly brackets `{`
and `}`. For example: `{propertyName}`. The names between the curly braces must match the properties of the class.

```
@Location("/list/{name}/page/{page}")
data class Listing(val name: String, val page: Int)
```

* Will match: `/list/movies/page/10`
* Will construct: `Listing(name = "movies", page = 10)`

### GET parameters

If you provide additional class properties that are not part of the path of the `@Location`, those parameters will be
obtained from the `GET`'s query string or `POST` parameters:

```
@Location("/list/{name}")
data class Listing(val name: String, val page: Int, val count: Int)
```

* Will match: `/list/movies?page=10&count=20`
* Will construct: `Listing(name = "movies", page = 10, count = 20)`

## Defining route handlers

Once you have defined the classes annotated with `@Location`, this feature artifact exposes new typed methods for
defining route handlers: `get`, `options`, `header`, `post`, `put`, `delete` and `patch`.

```
routing {
    get<Listing> { listing ->
        call.respondText("Listing ${listing.name}, page ${listing.page}")
    }
}
```

## Building URLs

You can construct URLs to your routes by calling `application.locations.href` with an instance of a class annotated
with `@Location`:

```
val path = application.locations.href(Listing(name = "movies", page = 10, count = 20))
```

So for this class, `path` would be `"/list/movies?page=10&count=20"`.

```
@Location("/list/{name}") data class Listing(val name: String, val page: Int, val count: Int)
```

If you construct the URLs like this, and you decide to change the format of the URL, you will just have to update
the `@Location` path, which is really convenient.

## Subroutes with parameters

You have to create classes referencing to another class annotated with `@Location` like this, and register them
normally:

```
routing {
    get<Type.Edit> { typeEdit -> // /type/{name}/edit
        // ...
    }
    get<Type.List> { typeList -> // /type/{name}/list/{page}
        // ...
    }
}
```

To obtain parameters defined in the superior locations, you just have to include those property names in your classes
for the internal routes. For example:

```
@Location("/type/{name}") data class Type(val name: String) {
	// In these classes we have to include the `name` property matching the parent.
	@Location("/edit") data class Edit(val parent: Type)
	@Location("/list/{page}") data class List(val parent: Type, val page: Int)
}
```

### Options

No options()

## Status Pages Documentation ([JetBrains](https://www.jetbrains.com))

Allow to respond to thrown exceptions.

### Description

The `StatusPages` feature allows Ktor applications to respond appropriately to any failure state.

### Usage

## Installation

This feature is installed using the standard application configuration:

```
fun Application.main() {
    install(StatusPages)
}
```

## Exceptions

The exception configuration can provide simple interception patterns for calls that result in a thrown exception. In the
most basic case, a `500` HTTP status code can be configured for any exceptions.

```
install(StatusPages) {
    exception<Throwable> { cause ->
        call.respond(HttpStatusCode.InternalServerError)
    }
}
```

More specific responses can allow for more complex user interactions.

```
install(StatusPages) {
    exception<AuthenticationException> { cause ->
        call.respond(HttpStatusCode.Unauthorized)
    }
    exception<AuthorizationException> { cause ->
        call.respond(HttpStatusCode.Forbidden)
    }
}
```

These customizations can work well when paired with custom status code responses, e.g. providing a login page when a
user has not authenticated.

Each call is only caught by a single exception handler, the closest exception on the object graph from the thrown
exception. When multiple exceptions within the same object hierarchy are handled, only a single one will be executed.

```
install(StatusPages) {
    exception<IllegalStateException> { cause ->
        fail("will not reach here")
    }
    exception<ClosedFileSystemException> {
        throw IllegalStateException()
    }
}
intercept(ApplicationCallPipeline.Fallback) {
    throw ClosedFileSystemException()
}
```

Single handling also implies that recursive call stacks are avoided. For example, this configuration would result in the
created IllegalStateException propagating to the client.

```
install(StatusPages) {
    exception<IllegalStateException> { cause ->
        throw IllegalStateException("")
    }
}
```

## Logging Exceptions

It is important to note that adding the handlers above will "swallow" the exceptions generated by your routes. In order
to log the actual errors generated, you can either log the `cause` manually, or simply re-throw it as shown below:

```
install(StatusPages) {
    exception<Throwable> { cause ->
        call.respond(HttpStatusCode.InternalServerError, "Internal Server Error")
        throw cause
    }
}
```

## Status

The `status` configuration provides a custom actions for status responses from within the application. Below is a basic
configuration that provides information about the HTTP status code within the response text.

```
install(StatusPages) {
    status(HttpStatusCode.NotFound) {
        call.respond(TextContent("${it.value} ${it.description}", ContentType.Text.Plain.withCharset(Charsets.UTF_8), it))
    }
}
```

## StatusFile

While the `status` configuration provides customizable actions on the response object, the more common solution is to
provide an error HTML page that visitors will see on an error or authorization failure. The `statusFile` configuration
provides that type of functionality.

```
install(StatusPages) {
    statusFile(HttpStatusCode.NotFound, HttpStatusCode.Unauthorized, filePattern = "error#.html")
}
```

This will resolve two resources from the classpath.

* On a `404`, it will return `error404.html`.
* On a `401`, it will return `error401.html`.

The `statusFile` configuration replaces any `#` character with the value of the status code within the list of
configured statuses.

## Redirections using StatusPages

When doing redirections by executing `call.respondRedirect("/moved/here", permanent = true)`, the rest of the callee
function is executed. So when doing redirections inside guard clauses, you have to return the function.

```
routing {
    get("/") {
        if (condition) {
            return@get call.respondRedirect("/invalid", permanent = false)
        }
        call.respondText("Normal response")
    }
}
```

Other frameworks, use exceptions on redirect, so the normal flow is broken and you can execute redirections in guard
clauses or subfunctions without having to worry about returning in all the subfunction chain. You can use the
StatusPages feature to simulate this:

```
fun Application.module() {
    install(StatusPages) {
        exception<HttpRedirectException> { e ->
            call.respondRedirect(e.location, permanent = e.permanent)
        }
    }
    routing {
        get("/") {
            if (condition) {
                redirect("/invalid", permanent = false)
            }
            call.respondText("Normal response")
        }
    }
}

class HttpRedirectException(val location: String, val permanent: Boolean = false) : RuntimeException()
fun redirect(location: String, permanent: Boolean = false): Nothing = throw HttpRedirectException(location, permanent)
```

### Options

* `exceptions` - Configures response based on mapped exception classes
* `status` - Configures response to status code value
* `statusFile` - Configures standard file response from classpath()

## ContentNegotiation Documentation ([JetBrains](https://www.jetbrains.com))

Provides automatic content conversion according to Content-Type and Accept headers.

### Description

The `ContentNegotiation` feature serves two primary purposes:

* Negotiating media types between the client and server. For this, it uses the `Accept` and `Content-Type` headers.
* Serializing/deserializing the content in the specific format, which is provided by either the
  built-in `kotlinx.serialization` library or external ones, such as `Gson` and `Jackson`, amongst others.

### Usage

## Installation

To install the `ContentNegotiation` feature, pass it to the `install` function in the application initialization code.
This can be the `main` function ...

```
import io.ktor.features.*
// ...
fun Application.main() {
  install(ContentNegotiation)
  // ...
}```
... or a specified `module`:

```

import io.ktor.features.*
// ... fun Application.module() { install(ContentNegotiation)
// ... }

```
## Register a Converter
To register a converter for a specified `Content-Type`, you need to call the register method. In the example below, two custom converters are registered to deserialize `application/json` and `application/xml` data:

```

install(ContentNegotiation) { register(ContentType.Application.Json, CustomJsonConverter())
register(ContentType.Application.Xml, CustomXmlConverter())
}

```
### Built-in Converters
Ktor provides the set of built-in converters for handing various content types without writing your own logic:

* `Gson` for JSON

* `Jackson` for JSON

* `kotlinx.serialization` for JSON, Protobuf, CBOR, and so on

See a corresponding topic to learn how to install the required dependencies, register, and configure a converter.

## Receive and Send Data
### Create a Data Class
To deserialize received data into an object, you need to create a data class, for example:

```

data class Customer(val id: Int, val firstName: String, val lastName: String)

```
If you use `kotlinx.serialization`, make sure that this class has the `@Serializable` annotation:

```

import kotlinx.serialization.Serializable

@Serializable data class Customer(val id: Int, val firstName: String, val lastName: String)

```

### Receive Data
To receive and convert a content for a request, call the `receive` method that accepts a data class as a parameter:

```

post("/customer") { val customer = call.receive<Customer>()
}

```
The `Content-Type` of the request will be used to choose a converter for processing the request. The example below shows a sample HTTP client request containing JSON data that will be converted to a `Customer` object on the server side:

```

POST http://0.0.0.0:8080/customer
Content-Type: application/json

{
"id": 1,
"firstName" : "Jet",
"lastName": "Brains"
}

```
### Send Data
To pass a data object in a response, you can use the `respond` method:

```

post("/customer") { call.respond(Customer(1, "Jet", "Brains"))
}

```
In this case, Ktor uses the `Accept` header to choose the required converter.

## Implement a Custom Converter
In Ktor, you can write your own converter for serializing/deserializing data. To do this, you need to implement the `ContentConverter` interface:

```

interface ContentConverter { suspend fun convertForSend(context: PipelineContext<Any, ApplicationCall>, contentType:
ContentType, value: Any): Any? suspend fun convertForReceive(context: PipelineContext<ApplicationReceiveRequest,
ApplicationCall>): Any? }

```
Take a look at the [GsonConverter](https://github.com/ktorio/ktor/blob/master/ktor-features/ktor-gson/jvm/src/io/ktor/gson/GsonSupport.kt) class as an implementation example.



### Options

No options()

## kotlinx.serialization Documentation ([JetBrains](https://www.jetbrains.com))

Handles JSON serialization using kotlinx.serialization library

### Description

ContentNegotiation allows you to use content converters provided by the `kotlinx.serialization` library. This library supports `JSON`, `CBOR`, `ProtoBuf`, and other formats.



### Usage

## Register the JSON Converter
To register the JSON converter in your application, call the `json` method:

```

import io.ktor.serialization.*

install(ContentNegotiation) { json()
}

```
Inside the `json` method, you can access the [JsonBuilder](https://kotlin.github.io/kotlinx.serialization/kotlinx-serialization-json/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/index.html) API, for example:

```

install(ContentNegotiation) { json(Json { prettyPrint = true isLenient = true // ... })
}

```
## Register an Arbitrary Converter
To register an arbitrary converter from the kotlinx.serialization library (such as Protobuf or CBOR), call the `serialization` method and pass two parameters:
* The required `ContentType` value.
* An object of the class implementing the required encoder/decoder.

For example, you can register the [Cbor](https://kotlin.github.io/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor/index.html) converter in the following way:

```

install(ContentNegotiation) { serialization(ContentType.Application.Cbor, Cbor.Default)
}

```

### Options

No options()

## Micrometer Metrics Documentation ([JetBrains](https://www.jetbrains.com))

Enables Micrometer metrics in your Ktor server application.

### Description

The [MicrometerMetrics](https://api.ktor.io/%ktor_version%/io.ktor.metrics.micrometer/-micrometer-metrics/index.html) feature enables [Micrometer](https://micrometer.io/docs) metrics in your Ktor server application and allows you to choose the required monitoring system, such as Prometheus, JMX, Elastic, and so on. By default, Ktor exposes metrics for monitoring HTTP requests and a set of low-level metrics for [monitoring the JVM][micrometer_jvm_metrics]. You can customize these metrics or create new ones.

### Usage

### Install MicrometerMetrics

<var name="feature_name" value="MicrometerMetrics"/>
<include src="lib.md" include-id="install_feature"/>

#### Exposed Metrics
Ktor exposes the following metrics for monitoring HTTP requests:
* `ktor.http.server.requests.active`: a [gauge](https://micrometer.io/docs/concepts#_gauges) that counts the amount of concurrent HTTP requests. This metric doesn't provide any tags.
* `ktor.http.server.requests`: a [timer](https://micrometer.io/docs/concepts#_timers) for measuring the time of each request. This metric provides a set of tags for monitoring request data, including `address` for a requested URL, `method` for an HTTP method, `route` for a Ktor route handling requests, and so on.

> The metric names may be [different](https://micrometer.io/docs/concepts#_naming_meters) depending on the configured monitoring system.

In addition to HTTP metrics, Ktor exposes a set of metrics for [monitoring the JVM](#jvm_metrics).

### Create a Registry

After installing `MicrometerMetrics`, you need to create a [registry for your monitoring system](https://micrometer.io/docs/concepts#_registry) and assign it to the [registry](https://api.ktor.io/%ktor_version%/io.ktor.metrics.micrometer/-micrometer-metrics/-configuration/registry.html) property. In the example below, the `PrometheusMeterRegistry` is created outside the `install` block to have the capability to reuse this registry in different [route handlers](Routing_in_Ktor.md):

```kotlin
import io.ktor.features.*
// ...
fun Application.module() {
    val appMicrometerRegistry = PrometheusMeterRegistry(PrometheusConfig.DEFAULT)
    install(MicrometerMetrics) {
        registry = appMicrometerRegistry
    }
}
```

### Prometheus: Expose a Scrape Endpoint

If you use Prometheus as a monitoring system, you need to expose an HTTP endpoint to the Prometheus scraper. In Ktor,
you can do this in the following way:

1. Create a dedicated [route](Routing_in_Ktor.md) that accepts GET requests by the required address (`/metrics` in the
   example below).
1. Use `call.respond` to send scraping data to Prometheus.

```kotlin
fun Application.module() {
    val appMicrometerRegistry = PrometheusMeterRegistry(PrometheusConfig.DEFAULT)

    install(MicrometerMetrics) {
        registry = appMicrometerRegistry
        // ...
    }

    routing {
        get("/metrics") {
            call.respond(appMicrometerRegistry.scrape())
        }
    }
}
```

### Options

The `MicrometerMetrics` feature provides various configuration options that can be accessed
using [MicrometerMetrics.Configuration](https://api.ktor.io/%ktor_version%/io.ktor.metrics.micrometer/-micrometer-metrics/-configuration/index.html)
.

### Timers

To customize tags for each timer, you can use the `timers` function that is called for each request:

```kotlin
install(MicrometerMetrics) {
    // ...
    timers { call, exception ->
        tag("region", call.request.headers["regionId"])
    }
}
```

### Distribution Statistics

You configure [distribution statistics](https://micrometer.io/docs/concepts#_configuring_distribution_statistics) using
the `distributionStatisticConfig` property, for example:

```kotlin
install(MicrometerMetrics) {
    // ...
    distributionStatisticConfig = DistributionStatisticConfig.Builder()
                .percentilesHistogram(true)
                .maximumExpectedValue(Duration.ofSeconds(20).toNanos())
                .sla(
                    Duration.ofMillis(100).toNanos(),
                    Duration.ofMillis(500).toNanos()
                )
                .build()
}
```

### JVM and System Metrics

In addition to [HTTP metrics](#ktor_metrics), Ktor exposes a set of metrics
for [monitoring the JVM][micrometer_jvm_metrics]. You can customize a list of these metrics using the `meterBinders`
property, for example:

```kotlin
install(MicrometerMetrics) {
    // ...
    meterBinders = listOf(
        JvmMemoryMetrics(),
        JvmGcMetrics(),
        ProcessorMetrics()
    )
}
```

You can also assign an empty list to disable these metrics at all.()

## Authentication Basic Documentation ([JetBrains](https://www.jetbrains.com))

Handle Basic authentication

### Description

Ktor supports two methods of authentication with the user and raw password as credentials: `basic` and `form`.

### Usage

```
install(Authentication) {
    basic(name = "myauth1") {
        realm = "Ktor Server"
        validate { credentials -> /*...*/ }
    }

    form(name = "myauth2") {
        userParamName = "user"
        passwordParamName = "password"
        challenge = FormAuthChallenge.Unauthorized
        validate { credentials -> /*...*/ }
    }
}

```

Both authentication providers have a method `validate` to provide a callback that must generate a Principal from given
a `UserPasswordCredential` or null for invalid credentials. That callback is marked as suspending, so that you can
validate credentials in an asynchronous fashion.

### Options

* basic
* form()

## Authentication JWT Documentation ([JetBrains](https://www.jetbrains.com))

Handle JWT authentication

### Description

Ktor supports `JWT` (JSON Web Tokens), which is a mechanism for authenticating JSON-encoded payloads. It is useful to
create stateless authenticated APIs in the standard way, since there are client libraries for it in a myriad of
languages.

This feature will handle Authorization: `Bearer <JWT-TOKEN>`.

Ktor has a couple of classes to use the JWT Payload as `Credential` or as `Principal`.

```
class JWTCredential(val payload: Payload) : Credential
class JWTPrincipal(val payload: Payload) : Principal

```

### Usage

## Configuring server/routes:

`JWT` and `JWK` each have their own method with slightly different parameters. Both require the realm parameter, which
is used in the `WWW-Authenticate` response header.

## Using a verifier and a validator:

The verifier will use the secret to verify the signature to trust the source. You can also check the payload within
validate callback to ensure everything is right and to produce a Principal.

### application.conf:

```
jwt {
    domain = "https://jwt-provider-domain/"
    audience = "jwt-audience"
    realm = "ktor sample app"
}

```

### JWT auth:

```
val jwtIssuer = environment.config.property("jwt.domain").getString()
val jwtAudience = environment.config.property("jwt.audience").getString()
val jwtRealm = environment.config.property("jwt.realm").getString()

install(Authentication) {
    jwt {
        realm = jwtRealm
        verifier(makeJwtVerifier(jwtIssuer, jwtAudience))
        validate { credential ->
            if (credential.payload.audience.contains(jwtAudience)) JWTPrincipal(credential.payload) else null
        }
    }
}

private val algorithm = Algorithm.HMAC256("secret")
private fun makeJwtVerifier(issuer: String, audience: String): JWTVerifier = JWT
        .require(algorithm)
        .withAudience(audience)
        .withIssuer(issuer)
        .build()

```

## Using a JWK provider:

```
fun AuthenticationPipeline.jwtAuthentication(jwkProvider: JwkProvider, issuer: String, realm: String, validate: (JWTCredential) -> Principal?)

```

```
val jwkIssuer = "https://jwt-provider-domain/"
val jwkRealm = "ktor jwt auth test"
val jwkProvider = JwkProviderBuilder(jwkIssuer)
            .cached(10, 24, TimeUnit.HOURS)
            .rateLimited(10, 1, TimeUnit.MINUTES)
            .build()
install(Authentication) {
    jwt {
        verifier(jwkProvider, jwkIssuer)
        realm = jwkRealm
        validate { credentials ->
            if (credentials.payload.audience.contains(audience)) JWTPrincipal(credentials.payload) else null
        }
    }
}

```

### Options

No options()

# Reporting Issues / Support

Please use [our issue tracker](https://youtrack.jetbrains.com/issues/KTOR) for filing feature requests and bugs. If
you'd like to ask a question, we recommmend [StackOverflow](https://stackoverflow.com/questions/tagged/ktor) where
members of the team monitor frequently.

There is also community support on the [Kotlin Slack Ktor channel](https://app.slack.com/client/T09229ZC6/C0A974TJ9)

# Reporting Security Vulnerabilities

If you find a security vulnerability in Ktor, we kindly request that you reach out to the JetBrains security team via
our [responsible disclosure process](https://www.jetbrains.com/legal/terms/responsible-disclosure.html).

# Contributing

Please see [the contribution guide](CONTRIBUTING.md) and the [Code of conduct](CODE_OF_CONDUCT.md) before contributing.

TODO: contribution of features guide (link)