# 📡 API Endpoints

Este documento describe los endpoints disponibles en la API de **Ojeador Deportivo**, tanto REST como GraphQL.

## 📌 Usuarios (REST)

| Método   | Endpoint              | Descripción                                           |
| -------- | --------------------- | ----------------------------------------------------- |
| **POST** | `/api/users/register` | Crear un nuevo usuario (`family` u `scout`).          |
| **POST** | `/api/users/login`    | Iniciar sesión y obtener token de autenticación.      |
| **GET**  | `/api/users/private`  | Obtener perfil privado del usuario autenticado.       |
| **PUT**  | `/api/users`          | Actualizar nombre de usuario o contraseña.            |
| **PUT**  | `/api/users/avatar`   | Subir o actualizar el avatar del usuario autenticado. |

## 📌 GraphQL

Los endpoints GraphQL están disponibles desde `/graphql`.

Ejemplos de operaciones:

- **Query:** Obtener perfil del usuario actual:

```graphql
query {
    getPrivateProfile {
        id
        username
        email
        role
    }
}
```

- **Mutation:** Registrar usuario:

```graphql
mutation {
    registerUser(
        input: {
            username: "josinho"
            email: "test@email.com"
            password: "Hackaboss17!"
            repeatedPass: "Hackaboss17!"
            role: "family"
        }
    ) {
        message
    }
}
```
