var AWS = require('aws-sdk');
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "Miaumiaumiau", "secretAccessKey": "Miaumiaumiau" //Agregar las Keys
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

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

save();