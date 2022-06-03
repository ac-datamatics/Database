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
All the dates should stick to the full ISO 8601 Coordinated Universal Time (UTC) format:
<p align="center">
<em>yyyy-mm-dd</em>T<em>hh:mm:ss.ms</em>Z
</p>

As in the next example:
<p align="center">
<em>2022-06-02T03:38:53.705Z</em>
</p>

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
<em>minDate &lt= Fecha de videos regresados &lt= maxDate</em>
</p>

##### /assigned_videos
Returns all the videos with *is_assigned = false* and whose *queue_id* is one of the input ids. This function performs a database table scan, with filters applied, which means it's **very expensive.** It receives a **JSON body with the next format:**

{
    "queues_ids": ["*[id_1]*", "*[id_2]*", "*[id_n]*"]
}

### POST Endpoints
##### /video
Creates a new table entry. The body may include at least the agentUsername and the callStartUTCDate (*partition* and *sort key*), but might include as much attributes as necessary. The method receives a **JSON with the next format:**

{
    "agentUsername": "*[vagentUsername_value]*",
    "callStartUTCDate": "*[callStartUTCDate_value]*",
    "*[attribute_1_name]*": "*[attribute_1_value]*",
    "*[attribute_2_name]*": "*[attribute_2_value]*",
    "*[attribute_3_name]*": "*[attribute_3_value]*"
}

### PATCH Endpoints
##### /video
Updates or adds one attribute to a table entry. Receives a **JSON with the next format:**
**

{
    "agentUsername": "*[vagentUsername_value]*",
    "callStartUTCDate": "*[callStartUTCDate_value]*",
    "*[updateKey]*": "*[attribute_name]*",
    "*[updateValue]*": "*[attribute_value]*"
}

### DELETE Endpoints
##### /video?agentUsername=*[agentUsername]*&callStartUTCDate=*[callStartUTCDate]*
Deletes a video database entry permanently. Date must be inserted in UTC format.