# ==========================================
# 1. 빌드 단계 (Build Stage)
# ==========================================
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# Gradle 의존성 라이브러리 캐싱을 위해 설정 파일 먼저 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# gradlew 실행 권한 부여
RUN chmod +x gradlew

# 소스 코드 복사 및 executable JAR 빌드 (테스트는 제외하여 빠른 빌드)
COPY src src
RUN ./gradlew bootJar -x test --no-daemon

# ==========================================
# 2. 실행 단계 (Run Stage)
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Builder 단계에서 생성된 JAR 파일 복사
COPY --from=builder /app/build/libs/*-SNAPSHOT.jar app.jar

# Render는 실행 시 $PORT 환경변수(기본값 10000 등)를 동적으로 주입합니다.
# Spring Boot가 해당 포트를 주입받아 구동되도록 설정합니다.
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]