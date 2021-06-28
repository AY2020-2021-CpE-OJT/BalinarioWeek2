const Joi = require('joi');
const express = require('express');
const MongoClient = require('mongodb').MongoClient
const app = express();
app.use(express.json()); //Middleware

MongoClient.connect('mongodb+srv://baluser:balpass@cluster0.knyif.mongodb.net/Task002DB?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('Task002DB');
    const dataCollection = db.collection('Task002MongoDB');
    app.get('/', (req, res) => {
       // const cursor = db.collection('Task002MongoDB').find().toArray();
       dataCollection.find({}).toArray(function (err, result) {
            if (err) throw err
            res.send(result);
       });
        //res.send(cursor);
    })
    app.post('/', (req,res) => {
        const result = validateInput(req.body);
        if (result.error) return res.status(400).send(result.error.details[0].message);

        dataCollection.insertOne(req.body);
         res.send(req.body); // returns the object in the body of the response
       });
    //console.log('chingchong');
});

function validateInput(input) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(input);
}

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> console.log(`Listening to port ${port}`)); 

  