var AWS = require('aws-sdk');
let awsConfig = {
    "region": "us-east-1", //Cambiar por la region
    "endpoint": "http://localhost:8000", //Cambiar por el endpoint de la base de datos
    "accessKeyId": "AKIAIOSFODNN7EXAMPLE", "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" //Cambiar por las credenciales de la base de datos
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let modify = function() {

    var params = { //Se cambiara para que no esté hardcodeado
        TableName: "Users", //Cambiar por el nombre de la tabla
        Key: { "Key_name": "Variable in key" }, //Cambiar lo que se vaya a buscar
        UpdateExpression: "set #name = :byUser, is_deleted = :boolValue", //Cambiar lo que se vaya a modificar
        ExpressionAttributeValues: {
            ":byUser": "updateUser", //Cambiar lo que se vaya a modificar
            ":boolValue": true
        },
        ReturnValues: "UPDATED_NEW"
    };
    docClient.update(params, function(err, data) {
        if (err) {
            console.log("Users::modify::error - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("Users::modify::success - " + JSON.stringify(data, null, 2));
        }
    });
}

modify();