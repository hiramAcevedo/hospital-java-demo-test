# 🏥 Sistema de Gestión de Citas Hospitalarias

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/) [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-brightgreen.svg)](https://spring.io/projects/spring-boot) [![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg)](https://www.typescriptlang.org/) [![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Este proyecto es un sistema completo para la gestión de citas hospitalarias que permite administrar doctores, pacientes, consultorios y citas médicas.

## 📋 Tabla de Contenidos

- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Características Implementadas](#-características-implementadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Mejoras Implementadas](#-mejoras-implementadas)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Contribuciones y Desarrollo Futuro](#-contribuciones-y-desarrollo-futuro)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

## 🛠️ Tecnologías Utilizadas

### 🔙 Backend
- **Java 17** - Lenguaje de programación principal
- **Spring Boot 3** - Framework para desarrollo de aplicaciones
- **Spring Data JPA** - Persistencia de datos simplificada
- **MySQL** - Sistema de gestión de base de datos
- **Maven** - Herramienta para gestión de dependencias

### 🖥️ Frontend
- **Next.js 14** - Framework de React con renderizado del lado del servidor
- **TypeScript** - Superset tipado de JavaScript
- **Material UI** - Biblioteca de componentes para la interfaz de usuario
- **React Hook Form** - Manejo eficiente de formularios
- **Axios** - Cliente HTTP para peticiones al servidor
- **React Hot Toast** - Sistema de notificaciones elegante

## ✨ Características Implementadas

### 👨‍⚕️ Gestión de Doctores
- Listado de doctores con búsqueda y filtrado
- Creación de nuevos doctores con detalles como especialidad y horarios
- Edición de información de doctores existentes
- Eliminación de doctores con confirmación
- Visualización detallada de información del doctor

### 🧑‍⚕️ Gestión de Pacientes
- Listado de pacientes con búsqueda por nombre
- Registro de nuevos pacientes
- Edición de datos de pacientes
- Eliminación de pacientes con confirmación
- Visualización de información detallada del paciente

### 📅 Gestión de Citas
- Calendario de citas por fecha
- Filtrado de citas por doctor y consultorio
- Programación de nuevas citas
- Edición de citas existentes
- Cancelación de citas
- Registro rápido de pacientes durante la creación de citas

### 🏥 Gestión de Consultorios
- Listado de consultorios disponibles
- Creación de nuevos consultorios

### 🎨 Interfaz de Usuario
- Diseño responsivo para dispositivos móviles y escritorio
- Tema personalizado con Material UI
- Barra lateral (Sidebar) para navegación rápida
- Barra superior (NavBar) con perfil y notificaciones
- Formularios validados para evitar errores
- Retroalimentación mediante notificaciones toast
- Diálogos de confirmación para acciones importantes

## 📂 Estructura del Proyecto

```
hospital-java-demo/
├── backend/               # Servidor Spring Boot
│   ├── src/main/java/     # Código fuente Java
│   │   ├── controllers/   # Controladores REST
│   │   ├── models/        # Entidades JPA
│   │   ├── repositories/  # Repositorios Spring Data
│   │   └── services/      # Capa de servicios
│   └── pom.xml            # Configuración Maven
│
└── frontend/              # Cliente Next.js
    ├── public/            # Archivos estáticos
    ├── src/               # Código fuente TypeScript/React
    │   ├── app/           # Páginas y rutas de Next.js
    │   │   ├── citas/     # Páginas de gestión de citas
    │   │   ├── consultorios/ # Páginas de gestión de consultorios
    │   │   ├── doctores/  # Páginas de gestión de doctores
    │   │   └── pacientes/ # Páginas de gestión de pacientes
    │   ├── components/    # Componentes React reutilizables
    │   ├── services/      # Servicios API con Axios
    │   └── types.ts       # Definiciones de tipos TypeScript
    └── package.json       # Dependencias npm
```

## 🚀 Mejoras Implementadas

### 🎯 UI/UX
- Se diseñó una interfaz moderna y limpia con Material UI
- Se creó un sistema de navegación consistente con sidebar y navbar
- Se implementaron confirmaciones visuales para acciones importantes
- Se añadieron indicadores de carga para operaciones asíncronas

### ⚙️ Funcionalidades
- CRUD completo para doctores, pacientes y citas
- Búsqueda y filtrado en todas las listas
- Validación de formularios con feedback inmediato
- Sistema de notificaciones para acciones exitosas o errores

### 💻 Técnicas
- Uso de TypeScript para tipado seguro
- Componentización y reutilización de código
- Implementación de estados globales donde era necesario
- Optimización de peticiones API

## 🔧 Instalación y Ejecución

### 📋 Requisitos previos
- Java 17+
- Node.js 18+
- MySQL 8+

### ⚙️ Backend
1. Configurar la base de datos en `application.properties`
2. Navegar al directorio `backend`
3. Ejecutar `mvn clean install` para instalar dependencias
4. Ejecutar `mvn spring-boot:run` para iniciar el servidor

### 🖥️ Frontend
1. Navegar al directorio `frontend`
2. Ejecutar `npm install` para instalar dependencias
3. Configurar la variable de entorno `NEXT_PUBLIC_API_URL` si es necesario
4. Ejecutar `npm run dev` para iniciar en modo desarrollo
5. Para producción, ejecutar `npm run build` seguido de `npm start`

## 🔮 Contribuciones y Desarrollo Futuro

- 🔐 Implementación de autenticación y autorización
- 📊 Dashboard con estadísticas y reportes
- 📱 Sistema de recordatorios por email/SMS
- 📆 Integración con Google Calendar
- 📲 Aplicación móvil con React Native

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## ✉️ Contacto

Hiram - [hiram.acevedo.lopez@gmail.com](mailto:hiram.acevedo.lopez@gmail.com)

Repositorio: [https://github.com/hiram/hiram-hospital-demo](https://github.com/hiram/hiram-hospital-demo)