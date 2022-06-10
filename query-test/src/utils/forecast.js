const request = require('request')

const forecast = (callback) => {
    const url = 'https://2uxbgsvox5.execute-api.us-east-1.amazonaws.com/Datamatics/video?agentUsername=edvilme&=2022-06-04T06:53:23.834Z&=2022-06-06T03:02:35.473Z'

    request({ url, json: true }, (error, archive) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (archive.body.error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, archive.body[0].rating)
        }
    })
}

module.exports = forecast