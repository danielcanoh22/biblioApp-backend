## 📚 BiblioApp Backend

Este repositorio contiene el backend para un sistema de gestión de biblioteca, construido con Node.js, Express y TypeScript. Proporciona una API RESTful para manejar libros, autores, géneros, usuarios y préstamos, con un sistema de autenticación basado en roles.

---

### 🚀 Tecnologías Utilizadas

Entorno de ejecución y creación de la API:

- 💚 Node.js
- ✨ Express.js

Desarrollo robusto y tipado estático:

- 🔰 TypeScript

Base de datos y autenticación:

- 🔵 MySQL
- 🔑 Bcrypt
- 🎭 JWT (JSON Web Tokens)

---

### 🚀 Características Principales

- **Autenticación**: Sistema de registro y login usando JSON Web Tokens (JWT) almacenados en cookies.
- **Gestión de Roles**: Dos niveles de acceso: `admin` (control total) y `user` (acceso limitado).
- **Operaciones CRUD Completas**: Endpoints para crear, leer, actualizar y eliminar recursos.

---

### 🚀 Configuración Inicial

Realizar la siguiente configuración antes de ejecutar el proyecto:

1. Clonar el repositorio

```bash
git clone https://github.com/danielcanoh22/biblioApp-backend.git
```

2. Navegar al directorio del proyecto

```bash
cd NombreDirectorio
```

3. Instalar las dependencias

```bash
npm install
```

4. Configurar las variables de entorno

- Crea una copia del archivo de ejemplo `.env` en la raiz del proyecto
- Modifica el archivo con las credenciales de la base de datos y otros secretos

**🔧 Variables de Entorno (Ejemplo)**

```env
# Archivo .env

# Configuración del servidor
PORT=3000
NODE_ENV = development # Si es para producción: production
CORS_ORIGIN = "http://localhost:5173"

# Configuración de la Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_SCHEMA=biblioteca_db
DB_PORT=3306

# Secretos de la Aplicación
JWT_SECRET=secreto_para_usar_JWT
COOKIE_NAME=authToken
```

5. Configurar la base de datos

- Crear la base de datos utilizando alguna aplicación como MySQL Workbench
- Crear las tablas respectivas ([script de ejemplo](https://drive.google.com/file/d/1-g_b4RBf5-_hIr8GCfoV98jns1lAizIm/view?usp=sharing))
- Iniciar la base de datos

---

### 🚀 Ejecución

Para ejecutar el proyecto en local, seguir los siguientes pasos:

1. Ejecutar el script de `seed.ts` para crear un usuario administrador inicial

```bash
npm run db:seed
```

2. Iniciar el servidor de desarrollo

```bash
npm run bs
```
