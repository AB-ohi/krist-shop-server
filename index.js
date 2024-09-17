const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use (cors());
app.use (express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qthn2pl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const mensCollection = client.db("shop").collection("men");
    const UserCollection = client.db("shop").collection("user");
  
    app.get('/men', async(req, res)=>{
      const menCloth = mensCollection.find();
      const result = await menCloth.toArray();
      res.send(result) 
    })

    app.get('/men/:id', async(req, res)=>{
      const id = req.params.id
      const selectItem = {_id: new ObjectId(id)}
      console.log(id)
      const result = await mensCollection.findOne(selectItem)
      if (result) {
        res.send(result);
      } else {
        res.status(404).send({ error: 'Man not found' });
      }
    })
    // app.get('/user/:name',async(req,res)=>{
    //   const name = req.params.name;
    //   const userId = {name: new ObjectId(name)};
    //   const result = await UserCollection.findOne(userId)
    //   res.send(result)
    // })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', function(req, res){
    res.send('server is running')
});

app.listen(port ,()=>{
    console.log(`server is running on port: ${port}`)
})