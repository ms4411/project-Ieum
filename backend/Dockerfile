FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# Alpine 리눅스 패키지 매니저로 gradle 직접 설치
RUN apk add --no-cache gradle

COPY build.gradle settings.gradle ./
COPY src src

# 시스템에 설치된 gradle 명령어 사용
RUN gradle bootJar -x test --no-daemon

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*-SNAPSHOT.jar app.jar
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]