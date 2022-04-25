var AWS = require('aws-sdk');
let awsConfig = {
    "region": "us-east-1", //Cambiar por la region
    "endpoint": "http://localhost:8000", //Cambiar por el endpoint de la base de datos
    "accessKeyId": "AKIAIOSFODNN7EXAMPLE", "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" //Cambiar por las credenciales de la base de datos
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();
let fetchOneByKey = function() {
    var params = {
        TableName: "Users", //Cambiar por el nombre de la tabla
        Key: {
            "email-id": "idk@gmail.com" //Cambiar lo que se vaya a buscar
        }
    };
    docClient.get(params, function(err, data) {
        if (err) {
            console.log("Users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("Users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
        }
    });
}

fetchOneByKey();