const AWS = require("aws-sdk");
const generarId = require("hash-generator");

const handler = async ({ pathParameters, httpMethod, body }) => {
  // Cargamos las credenciales y la región del config.json
  AWS.config.loadFromPath("./config.json");

  const dynamodb = new AWS.DynamoDB({ endpoint: "http://dynamodb:8000" });

  const docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: "2012-08-10",
    service: dynamodb,
  });
  const { TableNames: tables } = await dynamodb.listTables().promise();
  console.log(tables);
  if (!tables.includes("Envio")) {
    return {
      statusCode: 406,
      body: "La base de datos no ha sido actualizada, necesitas ejecutar node tables.js",
    };
  }
  switch (httpMethod) {
    case "GET":
      try {
        const envios = await docClient
          .scan({
            TableName: "Envio",
            IndexName: "EnviosPendientesIndex",
          })
          .promise();
        return {
          statusCode: 200,
          body: JSON.stringify(envios),
        };
      } catch (err) {
        console.log("Error GET", err);
        return {
          statusCode: 500,
          body: "Error, hubo un problema que no permite consultar los envíos pendientes",
        };
      }
    case "PUT":
      try {
        const idEnvio = (pathParameters || {}).idEnvio;
        const updateParams = {
          TableName: "Envio",
          Key: {
            id: idEnvio,
          },
          UpdateExpression: "REMOVE pendiente",
          ConditionExpression: "attribute_exists(pendiente)",
        };
        await docClient.update(updateParams).promise();
        return {
          statusCode: 200,
          body: `El envío con id ${idEnvio} fue entregado`,
        };
      } catch {
        return {
          statusCode: 500,
          body: `Error, hubo un problema que no permite actualizar el estado del envío con id: ${idEnvio}`,
        };
      }
    case "POST":
      try {
        const { destino, email } = body;
        const createParams = {
          TableName: "Envio",
          Item: {
            id: generarId(12),
            fechaAlta: new Date().toISOString(),
            destino: destino,
            email: email,
            pendiente: new Date().toISOString(),
          },
        };
        await docClient.put(createParams).promise();
        return {
          statusCode: 200,
          body: `El envío se creo correctamente con el id ${createParams.Item.id}`,
        };
      } catch {
        return {
          statusCode: 500,
          body: "Error, hubo un problema que no permite crear el envío",
        };
      }
    default:
      return {
        statusCode: 400,
        body: "La ruta ingresada no es válida",
      };
  }
};

exports.handler = handler;
