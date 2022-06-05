# Name
Datamatics CRUD API.

# Description
Application Programming Interface (API) with create, read, update and delete methods. This program connects with our DynamoDB, allowing the backend and frontend to interact with the database itself securely.

# Tools
This project uses the next technologies:
- JavaScript
- Amazon-Web-Services Software-Development-Kit for JavaScript

The program is intended to work via:
- AWS Lambda
- AWS API Gateway

# Usage
To use this API, access the invoke URL with the intended endpoint. Some endpoints might also require parameters or a body with attributes. Both input and output bodies should be in the JSON format:

### Read before using
All the dates should stick to the full ISO 8601 Coordinated Universal Time (UTC) string format:
<p align="center">
<em>yyyy-mm-dd</em>T<em>hh:mm:ss.ms</em>Z
</p>

As in the next example:
<p align="center">
<em>2022-06-02T03:38:53.705Z</em>
</p>

### Invoke URL
[https://2uxbgsvox5.execute-api.us-east-1.amazonaws.com/Datamatics](https://2uxbgsvox5.execute-api.us-east-1.amazonaws.com/Datamatics)

### GET Endpoints
##### /video
Returns all of the videos stored in the database, no filter applied. This methods performs a table scan, which is **very expensive.** Please avoid using it unnecessarily.
##### /video?agentUsername=*[agentUsername]*
Returns a list with all the videos uploaded by an agent, with its attributes.
##### /video?agentUsername=*[agentUsername]*&callStartUTCDate=*[callStartUTCDate]*
Returns the attributes of **an specific video.** Date must be inserted in UTC format.
##### /video?agentUsername=*[agentUsername]*&minDate=*[minDate]*&maxDate=*[maxDate]*
Returns a list of the videos in a date range (which must be inserted in UTC format). The query follows the next rule (which means the results are inclusive with the provided dates):
<p align="center">
<em>minDate &lt= Date of the returned videos &lt= maxDate</em>
</p>

##### /assigned_videos
Returns all the videos with *is_assigned = true* and whose *queue_id* is one of the input ids. This function performs a database table scan, with filters applied, which means it's **very expensive.** It receives a **JSON body with the next format:**

{
    <p>&nbsp; "queues_ids": ["*[id_1]*", "*[id_2]*", "*[id_n]*"]</p>
}

### POST Endpoints
##### /video
Creates a new table entry. The body may include at least the agentUsername and the callStartUTCDate (*partition* and *sort key*), but might include as much attributes as necessary. The method receives a **JSON with the next format:**

{
<p>
    &emsp;"agentUsername": "<em>[agentUsername_value]</em>",
    <br/>
    &emsp;"callStartUTCDate": "<em>[callStartUTCDate_value]</em>",
    <br/>
    &emsp;"<em>[attribute_1_name]</em>": "<em>[attribute_1_value]</em>",
    <br/>
    &emsp;"<em>[attribute_2_name]</em>": "<em>[attribute_2_value]</em>",
    <br/>
    &emsp;"<em>[attribute_3_name]</em>": "<em>[attribute_3_value]</em>"
</p>
}

### PATCH Endpoints
##### /video
Updates or adds one attribute to a table entry. Receives a **JSON with the next format:**

{
<p>
    &emsp;"agentUsername": "<em>[agentUsername_value]</em>",
    <br/>
    &emsp;"callStartUTCDate": "<em>[callStartUTCDate_value]</em>",
    <br/>
    &emsp;"updateKey": "<em>[attribute_name]</em>",
    <br/>
    &emsp;"updateValue": "<em>[attribute_value]</em>"
</p>
}

### DELETE Endpoints
##### /video?agentUsername=*[agentUsername]*&callStartUTCDate=*[callStartUTCDate]*
Deletes a video database entry permanently. Date must be inserted in UTC format.
