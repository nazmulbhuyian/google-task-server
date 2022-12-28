const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p8qnexq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const allTasks = client.db('googleTask').collection('data')
        const completeTask = client.db('googleTask').collection('completeTask')

        app.post('/addTasks', async (req, res) => {
            const tasks = req.body;
            const result = await allTasks.insertOne(tasks)
            res.send(result)
        })

        app.get('/myTasks', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await allTasks.find(query).toArray();
            res.send(result)
        })

        app.delete('/taskDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allTasks.deleteOne(query);
            res.send(result);
        })

        app.post('/taskComplete/:id', async (req, res) => {
            const tasks = req.body;
            const result = await completeTask.insertOne(tasks)
            res.send(result)
        })

        app.get('/completeTask', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await completeTask.find(query).toArray();
            res.send(result)
        })

        app.delete('/deleteTasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await completeTask.deleteOne(query)
            res.send(result);
        })

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    img: update.img,
                    about: update.about
                }
            }
            const result = await allTasks.updateOne(filter, updateDoc, options)
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.log)



app.get('/', (req, res) => {
    res.send('Google Task is running')
})

app.listen(port, () => {
    console.log(`Google Task start on port ${port}`)
})