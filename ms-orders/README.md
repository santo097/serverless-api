📦 ms-orders — API de Productos y Órdenes
🎯 Propósito

El microservicio ms-orders se encarga de:

Gestionar productos (precio, stock)

Gestionar órdenes (crear, listar, confirmar, cancelar)

Interactuar con ms-customer para validar clientes mediante el endpoint interno protegido

Cumplir con las reglas de negocio de stock, totales, idempotencia y cancelación

Este servicio forma parte del sistema mínimo compuesto por dos APIs y un Lambda orquestador.

🧩 Tecnologías usadas

Node.js + Express

TypeORM / MySQL

Validaciones con Zod / lógica de dominio según arquitectura hexagonal

Autenticación de llamadas a customer vía SERVICE_TOKEN

Documentación OpenAPI

Se puede levantar junto con otros servicios mediante Docker Compose

⚙️ Variables de entorno

Archivo: ms-orders/.env

PORT=3002
SERVICE_NAME=ms-orders

# Conexión MySQL (mismo servidor que ms-customer)
DB_TYPE=mysql
DB_HOST=blbymhcptmgag24en0uu-mysql.services.clever-cloud.com
DB_PORT=3306
DB_USERNAME=umr72s0kyc4v3zcv
DB_PASSWORD=RcD5LZq3VbSO6XxR7sLo
DB_NAME=blbymhcptmgag24en0uu

# URL del servicio de clientes (interno)
CUSTOMER_SERVICE_URL=http://localhost:3001

# Token para llamadas internas
SERVICE_TOKEN=classified-access-allowed


En Docker Compose, se debe remapear CUSTOMER_SERVICE_URL a http://customers-api:3001 si los servicios corren en containers.

▶️ Cómo levantar ms-orders
Con Docker Compose (parte del monorepo)

Desde la raíz del proyecto:

docker-compose up --build


Esto levantará:

ms-customer en http://localhost:3001

ms-orders en http://localhost:3002

MySQL u otros servicios según configuración

Local (sin Docker)

Dentro del directorio ms-orders:

npm install
npm run migrate
npm run seed
npm run dev


migrate aplica migraciones

seed carga datos de ejemplo

dev arranca en modo desarrollo (recarga automática)

🛣️ Endpoints del API
Productos

POST /products
Crear producto con cuerpo:

{
  "sku": "ABC123",
  "name": "Ratón Inalámbrico",
  "priceCents": 5000,
  "stock": 100
}


GET /products/:id
Obtener producto por ID

GET /products
Listar productos con query params:

search (string)

cursor (número)

limit (número)

PATCH /products/:id
Actualizar priceCents y/o stock

Órdenes

POST /orders
Crear una orden:

{
  "customerId": 3,
  "items": [
    { "productId": 1, "qty": 2 },
    { "productId": 2, "qty": 1 }
  ]
}


Valida cliente vía /internal/customers/:id en ms-customer con header Authorization: Bearer SERVICE_TOKEN

Verifica stock, calcula totales, crea CREATED y descuenta stock

GET /orders/:id
Obtener orden por ID, con sus items

GET /orders
Listar órdenes con filtros:

status

from

to

cursor

limit

POST /orders/:id/confirm
Confirmar orden (idempotente), espera header Idempotency-Key

POST /orders/:id/cancel
Cancelar orden:

Si la orden está CREATED, se cancela y restablece stock

Si está CONFIRMED, solo puede cancelarse dentro de 10 minutos

🔐 Interacción con Customers (endpoint interno)

Cuando ms-orders necesita validar un cliente, hace una llamada:

GET /internal/customers/:id


al ms-customer, incluyendo encabezado:

Authorization: Bearer classified-access-allowed


Si el token no coincide o no se proporciona, se lanza un error de autorización.

📄 Documentación OpenAPI

El archivo de especificación está en:

ms-orders/openapi.yaml


Incluye todos los endpoints, esquemas (Producto, Orden, Items) y ejemplos. Puedes usar Swagger UI para visualizarlo.

🧪 Ejemplos cURL
Crear producto
curl -X POST http://localhost:3002/products \
  -H "Content-Type: application/json" \
  -d '{"sku":"XYZ","name":"Teclado","priceCents":15000,"stock":50}'

Crear orden
curl -X POST http://localhost:3002/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":3,"items":[{"productId":1,"qty":2},{"productId":2,"qty":1}]}'

Confirmar orden
curl -X POST http://localhost:3002/orders/5/confirm \
  -H "Idempotency-Key: key-123"

Cancelar orden
curl -X POST http://localhost:3002/orders/5/cancel

🔧 Scripts disponibles (o sugeridos)

Dentro de ms-orders/package.json:

dev → iniciar con recarga automática

build → compilar TS a JS

start → modo producción

migrate → aplicar migraciones

seed → cargar datos de ejemplo

test → pruebas (si se implementan)

📋 Flujo de uso esperado

Se crean productos usando el API de productos.

Cuando se crea una orden mediante POST /orders:

Primero usa ms-customer para validar cliente.

Luego revisa stock, calcula totales y crea la orden en estado CREATED, descontando stock.

Cuando se confirma la orden con POST /orders/:id/confirm, se vuelve CONFIRMED de forma idempotente.

Se puede cancelar una orden en estado CREATED sin limitación, o en CONFIRMED solo dentro de 10 minutos, restaurando stock.