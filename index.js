const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB starts

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k7baavr.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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

    // come from node mongodb crud start
    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    // come from node mongodb crud end

    // CREATE api to receive data from client side starts
    app.post("/coffee", async (req, res) => {
      const newCOffee = req.body;
      console.log(newCOffee);
      // insert or add data to the mongodb database
      const result = await coffeeCollection.insertOne(newCOffee);
      // send result to the client
      res.send(result);
    });
    // CREATE api to receive data from client side end

    // READ starts
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // READ end

    // DELETE starts
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
    // DELETE end

    // UPDATE starts
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });
    // To get current information from client side
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      //after getting data from client side, now have to send data to mongodb
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const coffee = req.body;
      const updatedcoffee = {
        $set: {
          name: coffee.name,
          quantity: coffee.quantity,
          supplier: coffee.supplier,
          taste: coffee.taste,
          category: coffee.category,
          details: coffee.details,
          photo: coffee.photo,
        },
      };
      const result = await coffeeCollection.updateOne(
        filter,
        updatedcoffee,
        options
      );
      res.send(result);
    });
    // UPDATE end

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

// MongoDB end

app.get("/", (req, res) => {
  res.send("Coffee store server is running");
});
app.listen(port, () => {
  console.log(`Coffee server is running on port:${port}`);
});
