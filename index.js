const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


//middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.q0x3ff9.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('flytographer').collection('services');

        const orderCollection = client.db('flytographer').collection('orders');

        // const addCollection = client.db('flytographer').collection('addService');




        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();

            res.send(services);
        });

        app.get('/servicess', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();

            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });


        // orders api
        app.get('/orders', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        ////////////////////////

        // app.get('/collection', async (req, res) => {
        //     let query = {};

        //     if (req.query.email) {
        //         query = {
        //             email: req.query.email
        //         }
        //     }

        //     const cursor = addCollection.find(query);
        //     const orders = await cursor.toArray();
        //     res.send(orders);
        // });

        app.post('/services', async (req, res) => {
            const order = req.body;
            const result = await serviceCollection.insertOne(order);
            res.send(result);
        });

        /////////////////////////////////////
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.find(query).toArray();
            res.send(result);
        });

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }

}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('flytographer server is running')
})

app.listen(port, () => {
    console.log(`flytographer server running on ${port}`);
})

