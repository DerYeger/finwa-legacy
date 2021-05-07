FROM gradle:7.0.0 AS BUILDER

WORKDIR /usr/app/

COPY . .

RUN gradle shadowJar

FROM adoptopenjdk/openjdk15:alpine

COPY --from=BUILDER /usr/app/build/libs/finwa-backend.jar .

ENTRYPOINT [ \
    "java", \
    "-server", \
    "-jar", \
    "finwa-backend.jar" \
]