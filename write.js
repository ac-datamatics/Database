var AWS = require('aws-sdk');
let awsConfig = {
    "region": "us-east-1", //Cambiar por la region
    "endpoint": "http://localhost:8000", //Cambiar por el endpoint de la base de datos
    "accessKeyId": "AKIAIOSFODNN7EXAMPLE", "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" //Cambiar por las credenciales de la base de datos
};
AWS.config.update(awsConfig);

let dotClient = new AWS.DynamoDB.DocumentClient();

let save = function(){
    var input = { //Se cambiara para que no esté hardcodeado
        "Key_name": "Variable in key", "created_by": "user name", "created_on": new Date().toString(),
        "updated_by": "user name", "updated_on": new Date().toString(), "is_deleted": false
    };

    var params = {
        TableName: "Table name", //Cambiar por el nombre de la tabla
        Item: input
    };

    docClient.put(params, function(err, data) {
        if (err) {
            console.log("Users::save::error - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("Users::save::success - " + JSON.stringify(data, null, 2)); //Quitar el + despues de comprobar que funciona
        }
    });
}

save();