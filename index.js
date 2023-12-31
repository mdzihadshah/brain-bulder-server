const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Brain Buiders server j is Running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dkc5olm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("brainBuilders");
    const allToyCollection = database.collection("alltoy");

    app.get("/alltoy", async (req, res) => {
      const result = await allToyCollection.find().limit(20).toArray();
      res.send(result);
    });
    app.get("/alltoys", async (req, res) => {
      const result = await allToyCollection.find().toArray();
      res.send(result);
    });

    app.get("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToyCollection.findOne(query);
      res.send(result);
    });

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToyCollection.findOne(query);
      res.send(result);
    });

    app.get("/mytoy", async (req, res) => {
      console.log(req.query.email);
      let quary = {};
      if (req.query?.email) {
        quary = { email: req.query.email };
      } else {
        return;
      }
      console.log(quary);
      const result = await allToyCollection.find(quary).toArray();
      res.send(result);
    });

    app.post("/inserttoy", async (req, res) => {
      const toy = req.body;
      console.log(toy);
      const result = await allToyCollection.insertOne(toy);
      res.send(result);
    });
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToyCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const toy = req.body;
      const options = { upsert: true };
      const updateToy = {
        $set: {
          price: toy.price,
          quantity: toy.quantity,
          description: toy.description,
        },
      };

      const result = await allToyCollection.updateOne(
        query,
        updateToy,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Brain Builders is runnig port:${port}`);
});
