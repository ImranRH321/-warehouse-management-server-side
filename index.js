const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const objectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running ");
});

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.krjjj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// =======================================================|

async function run() {
  await client.connect();
  const carWareCollection = client.db("CarWareHouse").collection("inventory");
  try {
    /* load data  */
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = carWareCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
    /* inventory details */
    app.get("/details/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await carWareCollection.findOne(query);
      res.send(cursor);
    });

    app.delete("/manageItems/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carWareCollection.deleteOne(query);
      res.send(result);
    });

    // post add add
    app.post("/addItems", async (req, res) => {
      const userData = req.body;
      const result = await carWareCollection.insertOne(userData);
      res.send(result);
    });
    // myItems load data
    app.get("/myItems", async (req, res) => {
      const email = req.query.email;
      console.log(email, "email");
      if (email) {
        const items = await carWareCollection.find({ email: email }).toArray();
        console.log(items, "itmes ");
        res.send(items);
      }
    });

    //  /* ... */
    app.delete("/myItems/:id", async (req, res) => {
      const id = req.params.id;
      const items = await carWareCollection.deleteOne({ _id: ObjectId(id) });
      res.send(items);
    });
    // /* ... */

    app.put("/itemsQuantity/:id", async (req, res) => {
      const id = req.params.id;
      const DisplayQuantity = req.body;
      console.log(DisplayQuantity);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: DisplayQuantity.updateQuantity,
        },
      };
      const result = await carWareCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result, " res send quantity");
      res.send(result);
    });
  } finally {
    // client.close()
  }
}
run().catch(console.log);

app.listen(port, () => {
  console.log("server is running port", port);
});
