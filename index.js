const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zzdks.mongodb.net/EmaJhonStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



const app = express()
app.use(bodyParser.json())
app.use(cors())








client.connect(err => {
  const productsCollection = client.db("EmaJhonStore").collection("Products");
  const orderCollection = client.db("EmaJhonStore").collection("Orders");
    console.log('database cunnected');

    //Post method orthat clint site theke data niye sarver e pathano
    app.post('/addProducts', (req, res) =>{
        const products = req.body;
        productsCollection.insertOne(products)
        .then(item =>{
            console.log(item.insertedCount);
            res.send(item.insertedCount)
        })
    })

    //get methods orthat sarver thrkr data niya clinet site e dekhano
    app.get('/products', (req, res) =>{
        productsCollection.find({})
        .toArray((err, documents) =>{
            res.send(documents)
        })
    })

    //get methods orthat sarver thrkr data niya clinet site e dekhano
    app.get('/product/:key', (req, res) =>{
        productsCollection.find({key: req.params.key})
        .toArray((err, documents) =>{
            res.send(documents[0])
        })
    })

    app.post('/productsBeyKey', (req, res) =>{
        const productKey = req.body;
        productsCollection.find({key:{$in:productKey}})
        .toArray((err, documents) =>{
            res.send(documents)
        })
    })


    //Post method orthat clint site theke data niye sarver e pathano
    app.post('/addOrder', (req, res) =>{
        const orderInfo = req.body;
        orderCollection.insertOne(orderInfo)
        .then(item =>{
            console.log(item.insertedCount);
            res.send(item.insertedCount > 0)
        })
    })
});

app.get('/', (req, res) => {
  res.send('Hello World! how nare you')
})

app.listen(4000)