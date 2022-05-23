var AWS = require('aws-sdk');
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "MiaumiaumiauM", "secretAccessKey": "Miaumiaumiau" //Agregar las Keys
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let remove = function() {

    var params = {
        TableName: "Datamatics",
        Key: { 
            "agent_id": "2",
            "callStartUTCDate" : "Mon May 23 2022 17:04:36 GMT-0500 (Central Daylight Time)"
    }, //Cambiar lo que se vaya a buscar
    };
    docClient.delete(params, function(err, data) {
        if (err) {
            console.log("Datamatics::remove::error - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("Datamatics::remove::success - " + JSON.stringify(data, null, 2));
        }
    });
}

remove();