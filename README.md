# Sistema de Inventario IT

Sistema completo para gestionar el inventario de equipos informáticos de una empresa.

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Instalación

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Acceso

- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173

### Credenciales de prueba
- Email: `ana.lopez@empresa.com`
- Password: `Inventario2024!`

## Módulos

- **Dashboard** - KPIs y gráficos
- **Activos** - Gestión de equipos
- **Usuarios** - Control de acceso
- **Ubicaciones** - Lugares físicos
- **Categorías** - Clasificación
- **Proveedores** - Vendedores
- **Asignaciones** - Préstamos de equipos
- **Mantenimiento** - Órdenes de trabajo
- **Licencias** - Software
- **Consumibles** - Insumos
- **Documentos** - Archivos
- **Movimientos** - Historial

## Stack Tecnológico

### Backend
- Node.js + Express
- PostgreSQL + Sequelize
- JWT para autenticación

### Frontend
- React 18 + Vite
- TailwindCSS
- React Router
- Recharts (gráficos)
- Axios
