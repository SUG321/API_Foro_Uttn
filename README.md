# API_Foro_Uttn
Esta es una API de reserva para la aplicación "Foro UTTN" desarrollada como proyecto integrador de quinto semestre de la UTTN.

## Instalación de Node.js y dependencias

1. Instala **Node.js** (versión 14 o superior).
2. Descarga este repositorio y, dentro de él, ejecuta:

   ```bash
   npm install
   ```

   Este comando instala todas las dependencias listadas en `package.json`.

## Inicio del servidor

Para iniciar el servidor en modo desarrollo utiliza:

```bash
npm run dev
```


El comando anterior usa **nodemon** para cargar `server.js` y recargar automáticamente el servidor al detectar cambios.


## Endpoints de autenticación

- `POST /login` inicia sesión de un usuario existente.
- `POST /register` registra un nuevo usuario.


## Endpoints de gestión de posts

- `GET /posts` lista todas las publicaciones.
- `GET /posts/:id` obtiene los detalles de un post.
- `POST /posts` crea una nueva publicación.
- `PUT /posts/:id` actualiza un post existente.
- `DELETE /posts/:id` elimina un post.

## Endpoints de gestión de respuestas

- `GET /posts/:postId/responses` lista las respuestas de un post.
- `POST /posts/:postId/responses` crea una respuesta.
- `PUT /responses/:id` actualiza una respuesta existente.
- `DELETE /responses/:id` elimina una respuesta.


## Importación y exportación de la base de datos

En la carpeta `Archive/Scripts` se incluyen dos utilidades para respaldar la base de datos `foro_uttn`:

* `Importar.js` emplea `mongorestore` para restaurar los datos desde `Archive/Database`.
* `Exportar.js` utiliza `mongodump` para generar un respaldo en esa misma carpeta.

Para que estos scripts funcionen es necesario tener instaladas las **MongoDB Database Tools** (las utilidades `mongodump` y `mongorestore`).

Ejecuta los scripts con Node:

```bash
node Archive/Scripts/Importar.js   # importar datos
node Archive/Scripts/Exportar.js   # exportar datos
```