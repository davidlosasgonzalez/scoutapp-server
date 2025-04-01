# 📄 Base de Datos

Este documento describe la estructura de la base de datos utilizada en **Ojeador Deportivo**.

## 📌 Tablas Principales

### 📂 `users`

| Campo       | Tipo         | Descripción                          |
| ----------- | ------------ | ------------------------------------ |
| id          | INT UNSIGNED | Identificador único del usuario      |
| username    | VARCHAR(30)  | Nombre de usuario                    |
| first_name  | VARCHAR(50)  | Nombre del usuario                   |
| last_name   | VARCHAR(100) | Apellido del usuario                 |
| email       | VARCHAR(100) | Correo electrónico                   |
| password    | VARCHAR(100) | Contraseña encriptada                |
| birth_date  | DATE         | Fecha de nacimiento                  |
| avatar      | VARCHAR(100) | Nombre de archivo del avatar         |
| role        | ENUM         | Rol del usuario (`family` o `scout`) |
| created_at  | DATETIME     | Fecha de creación del usuario        |
| modified_at | DATETIME     | Última actualización del usuario     |

### 📂 `players`

| Campo          | Tipo         | Descripción                                           |
| -------------- | ------------ | ----------------------------------------------------- |
| id             | INT UNSIGNED | Identificador único del jugador                       |
| family_user_id | INT UNSIGNED | ID del usuario que registró al jugador                |
| first_name     | VARCHAR(50)  | Nombre del jugador                                    |
| last_name      | VARCHAR(100) | Apellido del jugador                                  |
| birth_date     | DATE         | Fecha de nacimiento                                   |
| position       | VARCHAR(50)  | Posición en el campo                                  |
| skills         | VARCHAR(500) | Habilidades destacadas                                |
| team           | VARCHAR(100) | Equipo actual del jugador                             |
| strong_foot    | ENUM         | Pie dominante (`derecha`, `izquierda`, `ambidiestro`) |
| created_at     | DATETIME     | Fecha de creación del jugador                         |
| modified_at    | DATETIME     | Última actualización del jugador                      |

### 📂 `player_videos`

| Campo      | Tipo         | Descripción                   |
| ---------- | ------------ | ----------------------------- |
| id         | INT UNSIGNED | Identificador único del video |
| player_id  | INT UNSIGNED | ID del jugador asociado       |
| youtube_id | VARCHAR(20)  | ID del vídeo de YouTube       |
| created_at | DATETIME     | Fecha de subida del video     |

### 📂 `hiring_requests`

| Campo         | Tipo         | Descripción                                   |
| ------------- | ------------ | --------------------------------------------- |
| id            | INT UNSIGNED | Identificador único de la solicitud           |
| scout_user_id | INT UNSIGNED | ID del ojeador que realizó la solicitud       |
| player_id     | INT UNSIGNED | ID del jugador asociado                       |
| status        | ENUM         | Estado (`pendiente`, `aceptada`, `rechazada`) |
| created_at    | DATETIME     | Fecha de creación de la solicitud             |
| modified_at   | DATETIME     | Última actualización de la solicitud          |
