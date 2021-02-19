val arkenvVersion: String by project
val jacocoVersion: String by project
val jUnitVersion: String by project
val koinVersion: String by project
val kotestVersion: String by project
val kotlinVersion: String by project
val kotlinResultVersion: String by project
val ktorVersion: String by project
val logbackVersion: String by project
val prometheusVersion: String by project

plugins {
    application
    kotlin("jvm")
    kotlin("plugin.serialization")
    id("org.jetbrains.dokka")
    id("org.jlleitschuh.gradle.ktlint")
    id("com.github.johnrengelman.shadow")
    jacoco
}

group = "eu.yeger"
version = "0.0.1"

application {
    mainClass.set("io.ktor.server.netty.EngineMain")
    // The following line is deprecated, but required for the shadowJar task
    mainClassName = "io.ktor.server.netty.EngineMain"
}

kotlin {
    explicitApi()
}

repositories {
    mavenLocal()
    jcenter()
    maven(url = uri("https://kotlin.bintray.com/ktor"))
}

dependencies {
    // Ktor
    implementation("io.ktor:ktor-server-core:$ktorVersion")
    implementation("io.ktor:ktor-auth:$ktorVersion")
    implementation("io.ktor:ktor-locations:$ktorVersion")
    implementation("io.ktor:ktor-server-host-common:$ktorVersion")
    implementation("io.ktor:ktor-serialization:$ktorVersion")
    implementation("io.ktor:ktor-metrics-micrometer:$ktorVersion")
    implementation("io.ktor:ktor-auth-jwt:$ktorVersion")
    implementation("io.ktor:ktor-server-netty:$ktorVersion")

    // Logging & Monitoring
    implementation("ch.qos.logback:logback-classic:$logbackVersion")
    implementation("io.micrometer:micrometer-registry-prometheus:$prometheusVersion")

    // Testing
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:$jUnitVersion")
    testImplementation("org.junit.jupiter:junit-jupiter-api:$jUnitVersion")
    testImplementation("io.ktor:ktor-server-tests:$ktorVersion")
    testImplementation("io.kotest:kotest-runner-junit5:$kotestVersion")
    testImplementation("io.kotest:kotest-assertions-core:$kotestVersion")
}

tasks {
    compileKotlin {
        kotlinOptions.jvmTarget = "1.8"
        kotlinOptions.useIR = true
        // Format the code before compilation
        dependsOn(ktlintFormat)
    }

    compileTestKotlin {
        kotlinOptions.jvmTarget = "1.8"
        kotlinOptions.useIR = true
    }

    withType<Test> {
        useJUnitPlatform()
    }

    shadowJar {
        archiveFileName.set("${project.name}.jar")
    }

    jacocoTestReport {
        reports {
            xml.isEnabled = true
            html.isEnabled = false
        }
    }

    withType<org.jetbrains.dokka.gradle.DokkaTask>().configureEach {
        dokkaSourceSets {
            named("main") {
                displayName.set("finwa-backend")
                reportUndocumented.set(true)
                sourceLink {
                    localDirectory.set(file("src/main/kotlin"))
                    remoteUrl.set(uri("https://github.com/DerYeger/finwa/tree/develop/backend/src/main/kotlin").toURL())
                }
            }
        }
    }
}

jacoco {
    toolVersion = jacocoVersion
}
