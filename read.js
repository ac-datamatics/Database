var AWS = require('aws-sdk');
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "Miaumiaumiau", "secretAccessKey": "Miaumiaumiau" //Agregar las Keys
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();
let fetchOneByKey = function() {
    var params = {
        TableName: "Datamatics", //Cambiar por el nombre de la tabla
        Key: {
            "agent_id": "1",
            "callStartUTCDate" : "2022-05-23T10:45:34Z"
        }
    };
    docClient.get(params, function(err, data) {
        if (err) {
            console.log("Datamatics::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("Datamatics::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
        }
    });
}

fetchOneByKey();