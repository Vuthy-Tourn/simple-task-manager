# Stage 1: Build
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copy Gradle wrapper and config
COPY gradlew .
COPY gradle ./gradle

# Copy project files
COPY build.gradle settings.gradle ./
COPY src ./src

# Make wrapper executable
RUN chmod +x gradlew

# Build the jar
RUN ./gradlew bootJar -x test

# Stage 2: Run
FROM eclipse-temurin:21-jre AS runner
WORKDIR /app

# Copy jar from builder
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]