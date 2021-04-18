const express = require('express')
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient;
// require('dotenv/config');
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const port = process.env.PORT || 5050;

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kmkzt.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err);
    const serviceCollection = client.db("happyEvents").collection("services");
    const orderCollection = client.db("happyEvents").collection("order");
    const reviewCollection = client.db("happyEvents").collection("review");
    const adminCollection = client.db("happyEvents").collection("admin");
    console.log('database Connected');

    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, service) => {
                res.send(service)
            })
    })

    app.get('/dmag/:id', (req, res) => {
        const id = req.params.id
        console.log(id);
        serviceCollection.find({ _id: ObjectId(id) })
            .toArray((err, item) => {
                res.send(item);
            })
    })



    app.post('/addService', (req, res) => {
        const newService = req.body
        serviceCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get("/allOrdered", (req, res) => {
        const queryEmail = req.query.email
        orderCollection.find({ email: queryEmail })
            .toArray((err, document) => {
                console.log(document);
                res.send(document)
            })
    })

    app.get("/orderedList", (req, res) => {
        orderCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })

    app.post('/addReview', (req, res) => {
        const review = req.body
        reviewCollection.insertOne(review)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
            .toArray((err, comment) => {
                res.send(comment)
            })
    })

    app.post('/addAdmin', (req, res) => {
        const admin = req.body
        adminCollection.insertOne(admin)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0)
            })

    })
    app.delete('/delete/:id', (req, res) => {
        serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
                console.log(result);
            })
    })

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
