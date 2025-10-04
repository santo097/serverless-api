🏗️ Monorepo Serverless-API

Este repositorio contiene el sistema mínimo compuesto por:

ms-customer: API para gestión de clientes

ms-orders: API para gestión de productos y órdenes

lambda-orchestrator: Función Lambda que orquesta la creación + confirmación de pedidos

db: Archivos schema.sql y seed.sql para base de datos

docker-compose.yml: Para levantar los servicios en local

README.md (este): documentación principal del proyecto

openapi.yaml por cada servicio para documentación formal

🎯 Objetivo del sistema

Construir dos APIs que operan sobre MySQL, documentadas y desplegables con Docker Compose.

Construir un Lambda orquestador (invocable por HTTP), que hace:

Validación de cliente en Customers API

Creación de la orden en Orders API

Confirmación de la orden con X-Idempotency-Key

Devuelve un JSON consolidado con los datos del cliente, orden confirmada y items

📂 Estructura del repo
/serverless-api
  ├── customers-api/
  ├── orders-api/
  ├── lambda-orchestrator/
  ├── db/
  │     ├── schema.sql
  │     └── seed.sql
  ├── docker-compose.yml
  ├── README.md (este archivo)
  ├── openapi-customer.yaml
  └── openapi-orders.yaml

⚙️ Configuración y dependencias

Cada microservicio tiene su propio .env con variables de entorno como:

Puerto (PORT)

Conexión MySQL (DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME)

SERVICE_TOKEN para comunicaciones internas

En orders, CUSTOMER_SERVICE_URL apuntando a ms-customer

Las APIs usan arquitectura hexagonal (puertos/adaptadores)

Validación con Zod o Joi (según implementación)

SQL parametrizado (prevención de SQL injection)

Documentación OpenAPI 3.0 para cada API

Scripts comunes sugeridos: dev, start, migrate, seed, build, test

🚀 Instrucciones para levantar local

Asegúrate de tener Docker y Docker Compose instalados.

En la raíz del repo, ejecuta:

docker-compose up --build


Esto levantará:

la base de datos MySQL

ms-customer en http://localhost:3001

ms-orders en http://localhost:3002

(Opcional) Si migraciones y seeds no están automatizadas, ejecuta manualmente en cada servicio.

Para probar el Lambda orquestador localmente (si lo integraste con serverless-offline):

Ve al directorio lambda-orchestrator, instala dependencias y levanta:

npm install
npx serverless offline


El endpoint será algo como:
POST http://localhost:3000/orchestrate

🧪 Ejemplos de uso
Crear cliente (customers)
curl -X POST http://localhost:3001/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria","email":"maria@ejemplo.com","phone":"+573001112222"}'

Crear producto (orders)
curl -X POST http://localhost:3002/products \
  -H "Content-Type: application/json" \
  -d '{"sku":"SKU123","name":"Producto X","priceCents":10000,"stock":20}'

Crear orden orquestada (via Lambda)
curl -X POST http://localhost:3000/orchestrate \
  -H "Content-Type: application/json" \
  -d '{"customerId":1,"items":[{"productId":1,"qty":2}]}'

📄 Documentación OpenAPI

openapi-customer.yaml: especifica los endpoints de ms-customer

openapi-orders.yaml: especifica los endpoints de ms-orders

Puedes cargarlos en Swagger UI o Editor para visualización y pruebas.

✅ Criterios de aceptación

Ambas APIs funcionan, están documentadas y levantan con Docker Compose.

Se puede crear una orden: valida cliente, stock, calcula totales y crea orden CREATED.

Confirmación de orden es idempotente vía X-Idempotency-Key.

Cancelación de orden restaura stock según reglas.

Lambda orquestador invocable por HTTP y retorna JSON consolidado.

El repo contiene scripts, docker-compose.yml, schema.sql, seed.sql y documentación clara.