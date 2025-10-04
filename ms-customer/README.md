 ms-customer — API de Clientes
 Propósito

Este microservicio es responsable de la gestión de clientes dentro del sistema general de pedidos.
Su rol principal:

Crear, actualizar, eliminar y consultar datos de clientes.

Exponer un endpoint interno protegido para que otros servicios (por ejemplo ms-orders) puedan validar que un cliente existe antes de crear órdenes.

 Características

API RESTful sobre MySQL.

Documentación OpenAPI 3.0.

Autenticación con token de servicio (SERVICE_TOKEN) para comunicaciones internas.

Estructura con diseño hexagonal (puertos/adaptadores).

Compatible para levantarse con Docker Compose como parte del ecosistema del monorepo.

 Variables de Entorno

Archivo: ms-customer/.env

PORT=3001
SERVICE_NAME=ms-customer

# Conexión MySQL
DB_TYPE=mysql
DB_HOST=xxxxxxx
DB_PORT=3306
DB_USERNAME=xxxxx
DB_PASSWORD=xxx
DB_NAME=xxxxx

# Token usado para accesos internos (Orders API)
SERVICE_TOKEN=classified-access-allowed


Asegúrate de no subir este archivo a GitHub si contiene credenciales sensibles. Usa .gitignore.

Levantamiento del servicio
Con Docker Compose (recomendado en el contexto del monorepo)

En la raíz del proyecto donde está docker-compose.yml, ejecuta:

docker-compose up --build


El servicio de clientes (ms-customer) estará disponible en http://localhost:3001.

Local (sin Docker)

Entrar al directorio ms-customer.

Instalar dependencias:

npm install


Ejecutar migraciones y carga de datos (si aplicaste ese mecanismo):

npm run migrate
npm run seed


Iniciar en modo desarrollo:

npm run dev

Endpoints públicos / internos
Publicos (para consumo general)

POST /customers
Crea un nuevo cliente.
Body:

{
  "name": "Carlos Ruiz",
  "email": "carlos@example.com",
  "phone": "+573001112233"
}


GET /customers/:id
Obtiene los datos de un cliente por su ID.

GET /customers
Consulta con filtros:

search: cadena de búsqueda en nombre o email

cursor: ID desde el cual paginar

limit: cantidad máxima de resultados

PUT /customers/:id
Actualiza campos del cliente (nombre, email, teléfono).

DELETE /customers/:id
(Opcional) Eliminación lógica o física según implementación.

Endpoint interno (para uso por otros servicios como Orders)

GET /internal/customers/:id
Igual al endpoint público GET /customers/:id, pero está protegido con token de servicio.

Requisitos:

Encabezado Authorization: Bearer SERVICE_TOKEN
Ejemplo: Authorization: Bearer classified-access-allowed

Si el token no coincide, devuelve 403 Forbidden.

Autenticación del token de servicio

Dentro del código, hay un adaptador ServiceTokenValidator que compara el token recibido con el valor configurado en SERVICE_TOKEN.
Este mecanismo asegura que solo servicios autorizados (como Orders) puedan consultar el endpoint interno.

Documentación OpenAPI

El archivo de especificación está en:

ms-customer/openapi.yaml


Puedes abrirlo con Swagger UI o Editor para ver todos los endpoints, esquemas y ejemplos.

Ejemplos cURL
Crear cliente
curl -X POST http://localhost:3001/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Luis","email":"luis@example.com","phone":"+573001112244"}'

Obtener cliente interno (utilizado por Orders)
curl -X GET http://localhost:3001/internal/customers/1 \
  -H "Authorization: Bearer classified-access-allowed"

Obtener cliente público
curl -X GET http://localhost:3001/customers/1

Scripts disponibles

Dentro de ms-customer/package.json, deberían existir (o puedes agregarlos):

dev – Iniciar en modo dev con recarga automática.

build – Compilar TS a JS si usas TypeScript.

start – Ejecutar en modo producción.

migrate – Aplicar migraciones a la base de datos.

seed – Cargar datos iniciales.

test – Ejecutar pruebas (si implementas tests).

 Flujo esperado en contexto del sistema

El operador crea un cliente mediante ms-customer.

Cuando se crea una orden en ms-orders, ese servicio llama a GET /internal/customers/:id enviando el token de servicio.

Si el cliente existe, ms-orders puede proceder a validar stock y crear la orden.

Más adelante, el Lambda orquestador también invocará ese endpoint interno para validar cliente antes de crear y confirmar órdenes de forma automatizada.