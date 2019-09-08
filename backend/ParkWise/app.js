const express = require('express')
const app = express()
const port = 30000



const MongoClient = require('mongodb').MongoClient

const getParkingData = (req, res) => {
// Connect to the db


  MongoClient.connect('mongodb://127.0.0.1:27017/parkwise', function (err, client) {
    if (err) throw err

    let db = client.db('parkwise')
    db.collection('parking').find().toArray(function (err, result) {
      if (err) throw err
      res.send(JSON.stringify(result))
    })
  })
}


app.get('/parking', getParkingData)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))