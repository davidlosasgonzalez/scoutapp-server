# 🏆 ScoutApp - API REST + GraphQL (en construcción)

Este repositorio contiene el backend del proyecto ScoutApp, una plataforma diseñada para conectar a jóvenes promesas del fútbol con ojeadores deportivos profesionales.

La API está construida con `Nest.js`, utilizando `TypeScript`, `MySQL` y `TypeORM`, y expone tanto endpoints `RESTful` como una `API GraphQL`. El backend gestiona la autenticación, usuarios, subida de avatar, jugadores, vídeos y contrataciones.

## 🔧 Configuración y Uso

1. **Instalar dependencias:**
    ```sh
    npm install
    ```
2. **Configurar variables de entorno:**
    ```sh
    cp .env.example .env
    ```
3. **Generar las tablas en la base de datos:**
   _(La sincronización se realiza automáticamente al lanzar los tests o levantar el servidor en desarrollo si está activada)_

4. **Iniciar el servidor en modo desarrollo:**
    ```sh
    npm run start:dev
    ```

## 🧪 Testing

- **Tests unitarios:**

    ```sh
    npm run test:unit
    ```

- **Tests e2e (end-to-end):**

    ```sh
    npm run test:e2e
    ```

- **Ver tests en modo watch:**
    ```sh
    npm run test:unit:watch
    ```

> Todos los tests utilizan una base de datos independiente (`NODE_ENV=test`) y sincronizan automáticamente las tablas.

## 🚀 Endpoints REST

- Los endpoints REST están disponibles bajo `/api`, por ejemplo:
    - `POST /api/users/register`
    - `POST /api/users/login`
    - `GET /api/users/private`

Para más detalles, consulta [`docs/endpoints.md`](./docs/endpoints.md).

## 🔮 GraphQL

- Accede a la playground en `http://localhost:3001/graphql`
- Define tus queries y mutations dentro del esquema SDL

## 📦 Estructura y dependencias principales

- **Nest.js v11**
- **TypeORM** con MySQL
- **JWT** para autenticación
- **GraphQL** con Apollo Server
- **class-validator** para validaciones DTO
- **Multer** para subida de archivos (avatar)
- **Jest** y **Supertest** para testing unitario y e2e

## 📁 Otros scripts útiles

```sh
npm run build              # Compila el proyecto a /dist
npm run lint               # Lint con ESLint + Prettier
npm run format             # Formatea los archivos TypeScript
npm run start:prod         # Lanza el servidor con Node desde /dist
```

## 🚀 BBDD & Endpoints

Para más detalles, consulta:

- [`docs/database.md`](./docs/database.md)
- [`docs/endpoints.md`](./docs/endpoints.md)
