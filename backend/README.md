# Guía de Instalación y Ejecución del Backend

## Pasos para Ejecutar

### 1. Instalar Dependencias
```bash
cd backend
npm install
```

### 2. Configurar Variables de Entorno
Edita el archivo `.env` con tus credenciales de PostgreSQL:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventario_equipos
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_AQUI
JWT_SECRET=cambiar_esto_en_produccion
PORT=3000
```

### 3. Iniciar el Servidor
```bash
# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

### 4. Probar la API
Abre tu navegador o Postman en:
- http://localhost:3000

## Endpoints Disponibles

### Autenticación (Públicos)
- `POST /api/auth/login` - Iniciar sesión

### Usuarios (Requieren autenticación)
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `POST /api/users` - Crear usuario (admin/manager)
- `PUT /api/users/:id` - Actualizar usuario (admin/manager)
- `DELETE /api/users/:id` - Eliminar usuario (admin)

### Activos (Requieren autenticación)
- `GET /api/assets` - Listar activos
- `GET /api/assets/:id` - Obtener activo
- `POST /api/assets` - Crear activo (admin/manager/operator)
- `PUT /api/assets/:id` - Actualizar activo (admin/manager/operator)
- `DELETE /api/assets/:id` - Eliminar activo (admin)

## Ejemplo de Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana.lopez@empresa.com"}'
```

Esto devolverá un token JWT que debes usar en los headers:
```
Authorization: Bearer TU_TOKEN_AQUI
```
