# Twitter Clone

## Instalación

Instalar Gestión de Inventario para una librería con npm

```bash
  git clone https://github.com/Lucascabral95/gestion-de-inventario-libreria.git
  cd gestion-inventario
  npm install 
  npm run start:dev
```
 
## 🌟 Descripción

Esta API RESTful permite gestionar los recursos de una librería, incluyendo libros, proveedores, empleados, categorías de libros, autores y movimientos dentro del sistema. La API está diseñada para facilitar la administración de los datos de la empresa y permitir la interacción segura entre administradores y empleados. 

## ⚙️ Características Principales:

- **📖 Gestión de Libros**: Permite agregar, actualizar, eliminar y consultar libros en la librería. Cada uno con su propia imagen ilustrativa.
- **🛒 Proveedores**: Control y administración de los proveedores de libros y otros recursos.
- **👥 Empleados y Administradores:**:Gestión de empleados con diferentes roles y privilegios de acceso.
- **📂 Categorías de Libros:**: Organización de los libros según sus categorías.
- **✍️ Autores:**: Registro y administración de autores de los libros, con sus fotos respesctivas.
- **🔄 Movimientos de la Librería:**: Seguimiento de transacciones y actividades internas, tanto de ventas a cliente, como de compras a proveedores.
- **🔄 Movimientos de la Librería:**: Información detallada para generar un dashboard con los datos administrativos claves de la empresa, como cantidad de productos, proveedores, empleados, así como los libros mas vendidos con sus montos en $, etc .
- **🔐 Autenticación Segura:**: Implementada mediante JSON Web Tokens (JWT) y cookies HTTP-only para proteger las rutas de acceso.

## 🔒 Seguridad y Autenticación:

- **JWT con Passport:**: Se genera un token JWT con los datos del usuario autenticado.
- **🔐 Autenticación Segura:**: El token se almacena en una cookie segura para permitir autenticación en rutas protegidas.
- **Cookies HTTP-only:**: Implementada mediante JSON Web Tokens (JWT) y cookies HTTP-only para proteger las rutas de acceso.
- **Control de Privilegios:**: Acceso restringido a ciertas acciones según el rol del usuario (administrador o empleado).

## 📄 Conclusión:

- **Gestión de Inventario para Librería**: Esta API RESTfull proporciona una solución robusta y escalable para la gestión integral de una librería, asegurando un control eficiente de elos recursos y una expereiencia optimizada para empleados y administradores. Gracias a su autenticación segura, su integración con Neon Serverless PostgreSQL y su sistema de interacción entre usuarios, esta plataforma garantiza un entorno confiable, accesible y flexible para la adminsitracion de una libreria en un entorno moderno. Está diseñada no solo para mostrar el catalogo de le librería, sino para crear un CMD (software de Gestión de Inventario).

## 🚀 Tecnologías Utilizadas 

- **Nest.js**: Framework de Node.js para la construcción de APIs escalables y mantenibles.
- **Neon Serverless PostgreSQL**: Base de datos relacional serverless que permite almacenar información de usuarios, publicaciones y relaciones entre ellos.
- **Passport.js con JWT**: Middleware de autenticación flexible y modular para la gestión de sesiones seguras.
- **TypeScript**: Superset de JavaScript que añade tipado estático y otras funcionalidades avanzadas, mejorando la calidad y el mantenimiento del código en aplicaciones grandes y complejas.

## 📬 Contacto

Si tenés alguna pregunta o sugerencia, no dudes en contactarme a través de lucassimple@hotmail.com o https://github.com/Lucascabral95

### Notas: 

- Añadí los siguientes modulos: **Auth**, **Product**, **Author**, **Category**, **Supplier** y **Stock_movement** para hacer el README más completo.
