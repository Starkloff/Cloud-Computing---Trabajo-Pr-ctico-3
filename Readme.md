# TP3 Computacion en la nube

## Requisitos

1. Instalar [Docker](https://www.docker.com/)
2. Instalar [Node](https://nodejs.org/es/)

## Instalar el proyecto

```bash
git clone https://github.com/Starkloff/Cloud-Computing---Trabajo-Pr-ctico-3.git
npm install
docker network create awslocal
docker run -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local:1.15.0 -jar DynamoDBLocal.jar -sharedDb
sam local start-api --docker-network awslocal
```

## Crear Tablas

```bash
node tables.js
```

## APIs Envíos

### Get Envíos Pendientes

Obtener los envíos que todavía no han sido entregados

#### URL

```
http://localhost:3000/envios/pendientes
```

### Post Crear Envío Pendiente

Crear envío que estará como pendiente de entrega

#### URL

```
http://localhost:3000/envios
```

#### Body

```json
{
  "destino": "Alem",
  "email": "a@gmail.com"
}
```

### Put Entregar Envío

Cambiar el estado de un envío Pendiente a Entregado

#### URL

```
http://localhost:3000/envios/${idEnvio}/entregado
```

## Autores

Ignacio Starkloff
