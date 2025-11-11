# SorteosFácil – SaaS de gestión de sorteos

Bienvenido a **SorteosFácil**, una plataforma SaaS construida con el stack **MERN + Firebase** que permite a los usuarios crear, administrar y vender números de sorteos de forma simple y rápida.

## 🎯 Tabla de contenidos

- [Descripción](#descripción)  
- [Tecnologías](#tecnologías)  
- [Características](#características)  
- [Arquitectura](#arquitectura)  
- [Instalación y configuración](#instalación-y-configuración)  
- [Uso](#uso)  
- [Despliegue](#despliegue)  
- [Límites en el plan gratuito de Firebase](#límites-en-el-plan-gratuito-de-firebase)  
- [Contribuciones](#contribuciones)  
- [Licencia](#licencia)  

---

## 📝 Descripción

SorteosFácil es una aplicación SaaS pensada para pequeñas empresas, organizaciones o personas que quieran gestionar sorteos de forma profesional sin complicarse con infraestructura.  
Desde el panel de administración puedes:

- Crear tu sorteo con hasta 100 números  
- Reservar números para compradores  
- Marcar números como vendidos  
- Liberar números en caso de cancelación  
- Visualizar estado activo / inactivo y administrar los sorteos  

Todo esto utilizando autenticación de usuarios, panel responsive y reglas de seguridad en la base de datos.

---

## 🧰 Tecnologías

- Frontend: React + TypeScript (Stack MERN orientado al frontend)  
- Backend & BFF: Firebase Authentication + Cloud Firestore  
- Framework de estilos: Tailwind CSS  
- Notificaciones: react-hot-toast  
- Despliegue: Frontend en Netlify, Backend (Firestore) en Firebase  
- Autenticación y seguridad gestionadas mediante reglas de Firestore  

---

## ✅ Características

- Registro e inicio de sesión de usuarios  
- Panel de usuario donde se listan los sorteos  
- Creación de sorteos con número limitado (100 números por sorteo)  
- Estado de los números: disponible → reservado → vendido  
- Funcionalidades exclusivas de dueño del sorteo:  
  - Reservar, vender y liberar números  
  - Cambiar estado activo/inactivo del sorteo  
  - Eliminar sorteos  
- Diseño responsive y adaptado para móviles  
- Modal de confirmación para acciones críticas  
- Notificaciones toast para feedback al usuario  
- Sistema gratuito inicial basado en el plan Spark de Firebase  

---

## 🏗️ Arquitectura

Frontend (React + Tailwind) ←→ Firebase Auth & Firestore
| |
UI Datos
| (colecciones: users, raffles, tickets)


- Cada sorteo (`raffles`) tiene subcolección de `tickets` (hasta 100 documentos por sorteo)  
- Reglas de seguridad en Firestore permiten:  
  - Lectura pública de sorteos  
  - Creación de sorteos sólo para usuarios autenticados  
  - Actualización de tickets por parte del dueño del sorteo o reserva pública  
  - Eliminación de sorteos sólo por el dueño  

---

## 🚀 Instalación y configuración

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Gadd88/saas-sorteos-facil.git
   cd saas-sorteos-facil

2. Instalar dependencias
    ```bash
    npm install
    ```

3. Configurar Firebase:
- Crear un proyecto en Firebase Console
- Habilitar Authentication (email/password)
- Crear Firestore Database
- Copiar las claves de configuración en el archivo .env (o similar), por ejemplo:

    ```bash
    REACT_APP_FIREBASE_API_KEY=…
    REACT_APP_FIREBASE_AUTH_DOMAIN=…
    REACT_APP_FIREBASE_PROJECT_ID=…
    REACT_APP_FIREBASE_STORAGE_BUCKET=…
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=…
    REACT_APP_FIREBASE_APP_ID=…
    ```
4. Ajustar reglas de Firestore (ejemplo simplificado):

    ```js
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // … (colocar las reglas vistas en el proyecto)
      }
    }
    ```

5. Ejecutar aplicación localmente

    ```bash
    npm start
    ```

## 🧑‍💼 Uso

- Inicia sesión o regístrate como nuevo usuario
- Desde el panel Mi Dashboard, haz clic en “+ Nuevo Sorteo”
- Configura título, descripción, premio y crea hasta 100 números
- En la vista del sorteo, podrás:
    - Ver todos los números y sus estados
    - Reservar números (como dueño)
    - Vender o liberar números
    - Cambiar estado del sorteo (activo/inactivo)
    - Eliminar el sorteo
- Las notificaciones toast y modales te guían durante la interacción

## 📊 Límites en el plan gratuito de Firebase

- Para comenzar, el sistema limita a 3 sorteos por usuario para maximizar el uso dentro del plan gratuito.

## 🤝 Contribuciones
```bash
¡Las contribuciones son bienvenidas!
Si querés sugerir mejoras, arreglar bugs o proponer nuevas funcionalidades, abrí un issue o un pull request.
Por favor asegúrate de que el código esté formateado, siga las mejores prácticas de React/TypeScript y tenga documentación básica.
```

## 📄 Licencia

Este proyecto está licenciado bajo la MIT License – ver el archivo LICENSE para más detalles.

¡Gracias por pasar por aquí y por ayudar a que SorteosFácil sea cada vez mejor! 🎉
