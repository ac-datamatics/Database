const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'Datamatics';
const videoPath = '/video';
const assignedVideosPath = '/assigned_videos';


exports.handler = async function(event) { // Main function, calls the intended method
    console.log('Request event: ', event);
    let response;
    switch(true){
        case event.httpMethod === 'GET' && event.path === videoPath: // Get videos
            if (event.queryStringParameters == null) { // If we receive no parameters we just return all the videos
                response = await getAllVideos();
            } else if (event.queryStringParameters.callStartUTCDate != null) { // If we receive a date we return the specific video
                response = await getVideoById(event.queryStringParameters.agentUsername, event.queryStringParameters.callStartUTCDate);
            } else if (event.queryStringParameters.minDate != null && event.queryStringParameters.maxDate != null){ // If we receive a min and max date we use our filter by date function
                response = await getVideosByAgent(event.queryStringParameters.agentUsername, event.queryStringParameters.minDate, event.queryStringParameters.maxDate);
            } else { // Else we return all the videos for an specific agent
                response = await getVideosByAgent(event.queryStringParameters.agentUsername);
            }
            break;
        case event.httpMethod === 'GET' && event.path === assignedVideosPath:
            response = await getAssignedVideos(JSON.parse(event.body).queues_ids);
            break;
        case event.httpMethod === 'POST' && event.path === videoPath:
            response = await saveVideo(JSON.parse(event.body));
            break;
        case event.httpMethod === 'PATCH' && event.path === videoPath:
            const requestBody = JSON.parse(event.body);
            response = await modifyVideo(requestBody.agentUsername, requestBody.callStartUTCDate, requestBody.updateKey, requestBody.updateValue);
            break;
        case event.httpMethod === 'DELETE' && event.path === videoPath:
            response = await deleteVideo(event.queryStringParameters.agentUsername, event.queryStringParameters.callStartUTCDate);
            break;
        default:
            response = buildResponse(404, {message: 'Not found'});
    }
    return response;
}

async function scanDynamoTable(scanParams, itemArray) { // Perform a table scan with the indicated parameters
    try {
        const dynamoData = await dynamodb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        if (dynamoData.LastEvaluateKey) {
            scanParams.ExclusiveStartKey = dynamoData.LastEvaluateKey;
            return await scanDynamoTable(scanParams, itemArray);
        }
        return itemArray;
    } catch(error) {
        console.error("Scan couldn't be completed, error: ", error);
    }
}

async function getAllVideos(params) { // Get all published videos by performing a table scan. Note: avoid this since it's very expensive
    if (params == null) {
        params = {
            TableName: dynamodbTableName
        }
    }
    
    const allVideos = await scanDynamoTable(params, []);
    const body = {
        videos: allVideos
    }
    return buildResponse(200, body);
}

async function getVideoById(agentUsername, callStartUTCDate) { // Get a single video specifying its agentUsername and callStartUTCDate
    const params = {
        TableName: dynamodbTableName,
        Key: {
            "agentUsername": agentUsername,
            "callStartUTCDate": callStartUTCDate
        }
    }
    
    return await dynamodb.get(params).promise().then((response) => {
        return buildResponse(200, response.Item);
    }, (error) => {
        console.error('An error has ocurred: ', error);
    });
}

async function getVideosByAgent(agentUsername, minDate, maxDate) { // Gets all videos for an agent. Could filter them by date.
    let keyConditionExpression = "agentUsername = :v1";
    
    if (minDate != null & maxDate != null) {
        keyConditionExpression += " and callStartUTCDate BETWEEN :v2a AND :v2b";
    }
    
    const params = {
        TableName: dynamodbTableName,
        ExpressionAttributeValues: {
            ":v1": agentUsername,
            ":v2a": minDate,
            ":v2b": maxDate
        },
        KeyConditionExpression: keyConditionExpression
    }
    
    return await dynamodb.query(params).promise().then((response) => {
        console.log(response.Items);
        return buildResponse(200, response.Items);
    }, (error) => {
        console.error('An error has ocurred: ', error);
    });
}

async function getAssignedVideos(queues_ids) {
    let filterExpression = "#is_assigned = :v1 and queue_id IN (";
    let expressionAttributeValues = {
        ":v1": true
    }
    let valueId;
    
    for (let i of queues_ids) {
        valueId = ":" + i;
        filterExpression += (i == queues_ids[0] ? "" : ", ") + valueId;
        expressionAttributeValues[valueId] = i;
    }
    filterExpression += ")";
    
    const params = {
        TableName: dynamodbTableName,
        FilterExpression: filterExpression,
        ExpressionAttributeNames: {
            "#is_assigned": "is_assigned"
        },
        ExpressionAttributeValues: expressionAttributeValues
    }
    
    return getAllVideos(params); // We call our getAllVideos, which will perform a table scan with our provided parameters/filters.
}

async function saveVideo(requestBody) { // Save video. Use as much parameters as wanted
    const params = {
        TableName: dynamodbTableName,
        Item: requestBody
    }
    
    return await dynamodb.put(params).promise().then(() => {
        const body = {
            Operation:  'SAVE',
            Message: 'SUCCESS',
            Item: requestBody
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error("Video couldn't be inserted, error: ", error);
    })
}

async function modifyVideo(agentUsername, callStartUTCDate, updateKey, updateValue) { // Modify one attribute of an uploaded video
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'agentUsername': agentUsername,
            'callStartUTCDate': callStartUTCDate
        },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: {
            ':value': updateValue
        },
        ReturnValues: 'UPDATED_NEW'
    }
    
    return await dynamodb.update(params).promise().then((response) => {
        const body = {
            Operation: 'UPDATE',
            Message: 'SUCCESS',
            Item: response
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error("Video couldn't be modified, error: ", error);
    })
}

async function deleteVideo(agentUsername, callStartUTCDate) {
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'agentUsername': agentUsername,
            'callStartUTCDate': callStartUTCDate
        },
        ReturnValues: 'ALL_OLD'
    }
    
    return await dynamodb.delete(params).promise().then((response) => {
        const body = {
            Operation: 'DELETE',
            Message: 'SUCCESS',
            Item: response
        }
        return buildResponse(200, body)
    }, (error) => {
        console.error("Video couldn't be deleted, error: ", error);
    })
}

function buildResponse(statusCode, body) { // This method will build the response for any of the methods utilized
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    }
}
