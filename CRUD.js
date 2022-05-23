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

let save = function(){
    var input = { //Se cambiara para que no esté hardcodeado
        "agent_id": "2", "callStartUTCDate": new Date().toString(),
        "mergedRecordingURL": "www.testurl.com/recording/idk", "rating": 5, "sentimentAnalysisURL": "www.anotherurl.com/sentiment/idk",
        "transcriptURL": "www.yetanotherurl.com/transcript/idk"
    };

    var params = {
        TableName: "Datamatics",
        Item: input
    };

    docClient.put(params, function(err, data) {
        if (err) {
            console.log("Datamatics::save::error - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("Datamatics::save::success - " + JSON.stringify(data, null, 2)); //Quitar el + despues de comprobar que funciona
        }
    });
}

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