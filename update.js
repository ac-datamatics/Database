var AWS = require('aws-sdk');
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "Miaumiaumiau", "secretAccessKey": "Miaumiaumiau" //Agregar las Keys
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let modify = function() {

    var params = { //Se cambiara para que no esté hardcodeado
        TableName: "Datamatics", //Cambiar por el nombre de la tabla
        Key: { 
            "agent_id": "2",
            "callStartUTCDate" : "Mon May 23 2022 17:04:36 GMT-0500 (Central Daylight Time)"
        }, //Recuerden cambiar los valores que se buscan no las keys
        UpdateExpression: "set rating = :rating", //Aqui se agregan los keys que se van a modificar
        ExpressionAttributeValues: {
            ":rating": 3, //De lo anterior se ponen los valores que se van a modificar
        },
        ReturnValues: "UPDATED_NEW"
    };
    docClient.update(params, function(err, data) {
        if (err) {
            console.log("Datamatics::modify::error - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("Datamatics::modify::success - " + JSON.stringify(data, null, 2));
        }
    });
}

modify();