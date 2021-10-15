// Cargamos AWS SDK para Node.js
const AWS = require("aws-sdk");

// Cargamos las credenciales y la región del config.json
AWS.config.loadFromPath("./config.json");

const ddb = new AWS.DynamoDB({ endpoint: "http://localhost:8000" });

// 1. Creación de tabla
const tableParams = {
  AttributeDefinitions: [
    {
      AttributeName: "id",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "id",
      KeyType: "HASH",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: "Envio",
  StreamSpecification: {
    StreamEnabled: false,
  },
};

// 2. Creación de indices
const indexParams = {
  AttributeDefinitions: [
    {
      AttributeName: "id",
      AttributeType: "S",
    },
    {
      AttributeName: "pendiente",
      AttributeType: "S",
    },
  ],
  TableName: "Envio",
  GlobalSecondaryIndexUpdates: [
    {
      Create: {
        IndexName: "EnviosPendientesIndex",
        KeySchema: [
          {
            AttributeName: "id",
            KeyType: "HASH",
          },
          {
            AttributeName: "pendiente",
            KeyType: "RANGE",
          },
        ],
        Projection: {
          ProjectionType: "INCLUDE",
          NonKeyAttributes: ["pendiente"],
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    },
  ],
};

ddb.createTable(tableParams, function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success table", data);
    ddb.updateTable(indexParams, function (err, data) {
      if (err) console.log("Error", err);
      else console.log("Success index", data);
    });
  }
});
