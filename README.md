# Project Documentation

## Project Overview
This is a full-stack application with a Svelte frontend and Node.js backend, implementing a vehicle and construction management system.

## Tech Stack

### Frontend Stack
- **Framework**: Svelte 5.0.0
- **Build Tool**: Vite 5.0.11
- **Language**: TypeScript 5.0.0
- **State Management**: Svelte Stores
- **HTTP Client**: Axios 1.7.7
- **UI Components**: Svelte Sonner 0.3.28
- **Development Tools**:
  - SvelteKit 2.0.0
  - Svelte Check 4.0.0
  - Various Svelte adapters (auto, node, static)

### Backend Stack
- **Runtime**: Node.js
- **Framework**: Express.js 4.21.1
- **Database**: MySQL (via mysql2 3.11.4)
- **ORM**: Sequelize 6.37.5
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Security**: bcryptjs 2.4.3
- **File Upload**: Multer 1.4.5
- **Validation**: Express Validator 7.2.0
- **CORS**: cors 2.8.5

## Detailed Project Structure

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── components/
│   │   ├── asignaciones/    # Assignment-related components
│   │   ├── auth/           # Authentication components
│   │   └── layout/         # Layout components
│   ├── routes/
│   │   ├── admin/          # Admin routes
│   │   ├── coordinadora/   # Coordinator routes
│   │   ├── conductor/      # Driver routes
│   │   ├── dashboard/      # Dashboard routes
│   │   ├── login/          # Login routes
│   │   └── +page.svelte    # Main page
│   ├── lib/                # Library code and utilities
│   ├── stores/             # Svelte stores for state management
│   ├── utils/              # Utility functions
│   ├── app.html            # Main HTML template
│   └── app.d.ts            # TypeScript declarations
├── static/                 # Static assets (images, fonts, etc.)
├── dist/                   # Production build output
├── build/                  # Build artifacts
├── node_modules/           # Dependencies
├── package.json            # Frontend dependencies and scripts
├── svelte.config.js        # Svelte configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

### Backend (`/backend`)
```
backend/
├── config/
│   └── database/
│       └── Connection.js    # Database connection configuration
├── controllers/
│   ├── asignacionObraController.js  # Work assignment controller
│   ├── vehiculoController.js        # Vehicle controller
│   ├── obraController.js            # Construction site controller
│   ├── userController.js            # User controller
│   └── authController.js            # Authentication controller
├── middlewares/
│   ├── roleMiddleware.js            # Role-based access control
│   ├── auth.js                      # Authentication middleware
│   ├── fileUpload.js                # File upload handling
│   └── authValidator.js             # Authentication validation
├── models/
│   ├── init-models.js               # Model initialization
│   ├── vehiculo.js                  # Vehicle model
│   ├── asignacionobra.js            # Work assignment model
│   ├── historialvehiculoobra.js     # Vehicle history model
│   ├── obra.js                      # Construction site model
│   ├── permiso.js                   # Permission model
│   ├── producto.js                  # Product model
│   ├── rol.js                       # Role model
│   ├── rolpermiso.js                # Role-Permission model
│   └── usuario.js                   # User model
├── routes/
│   ├── vehiculo.js                  # Vehicle routes
│   ├── asignacionObra.js            # Work assignment routes
│   ├── user.js                      # User routes
│   ├── obra.js                      # Construction site routes
│   └── auth.js                      # Authentication routes
├── node_modules/                    # Dependencies
└── package.json                     # Backend dependencies and scripts
```

## Database Models
The application includes the following main models:
- **Usuario**: User management
- **Vehiculo**: Vehicle management
- **Obra**: Construction site management
- **AsignacionObra**: Work assignments
- **HistorialVehiculoObra**: Vehicle history at construction sites
- **Rol**: User roles
- **Permiso**: System permissions
- **RolPermiso**: Role-Permission relationships
- **Producto**: Product management

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file with necessary database and JWT configurations

4. Start the server:
   ```bash
   npm start
   ```

## Development
- Frontend runs on `http://localhost:5173` (default Vite port)
- Backend runs on `http://localhost:3000` (default Express port)

## Build and Deployment
### Frontend
To create a production build:
```bash
cd frontend
npm run build
```

### Backend
To start the production server:
```bash
cd backend
npm start
```

## Additional Notes
- The frontend uses TypeScript for type safety
- The backend follows MVC architecture with Sequelize ORM
- Authentication is handled using JWT tokens
- File uploads are managed using Multer
- CORS is configured for frontend-backend communication
- Role-based access control is implemented in the backend
- The application supports multiple user roles (admin, coordinator, driver)
