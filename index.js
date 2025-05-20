  const express = require("express");
  const cors = require("cors");
  const app = express();
  require("dotenv").config();
  const port = process.env.PORT || 5000;

  app.use(cors());
  app.use(express.json());

  const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qthn2pl.mongodb.net/?retryWrites=true&w=majority`;

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

      const mensCollection = client.db("shop").collection("men");
      const womensCollection = client.db("shop").collection("women");
      const footsCollection = client.db("shop").collection("foots");
      const kidsCollection = client.db("shop").collection("kids");
      const BAndFCollection = client.db("shop").collection("[b&f]");
      const westernCollection = client.db("shop").collection("western");
      const UserCollection = client.db("shop").collection("user");
      const addressCollection = client.db("shop").collection("addressData");
      const contactCollection = client.db("shop").collection("contact");
      const userAddressCollection = client.db("shop").collection("user_address");
      const all_productCollection = client.db("shop").collection("all_product");

      app.get("/men", async (req, res) => {
        const menCloth = mensCollection.find();
        const result = await menCloth.toArray();
        res.send(result);
      });
      
      app.get("/men/:id", async (req, res) => {
        const id = req.params.id;
        const selectItem = { _id: new ObjectId(id) };
        console.log(id);
        const result = await mensCollection.findOne(selectItem);
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ error: "Man not found" });
        }
      });



      app.get("/women", async (req, res) => {
        const menCloth = womensCollection.find();
        const result = await menCloth.toArray();
        res.send(result);
      });
      app.get("/foot", async (req, res) => {
        const menCloth = footsCollection.find();
        const result = await menCloth.toArray();
        res.send(result);
      });
      app.get("/kids", async (req, res) => {
        const menCloth = kidsCollection.find();
        const result = await menCloth.toArray();
        res.send(result);
      });
      app.get("/b&f", async (req, res) => {
        const menCloth = BAndFCollection.find();
        const result = await menCloth.toArray();
        res.send(result);
      });
      app.get("/western", async (req, res) => {
        const menCloth = westernCollection.find();
        const result = await menCloth.toArray();
        res.send(result);
      });

      app.get("/user", async (req, res) => {
        const user = UserCollection.find();
        const result = await user.toArray();
        res.send(result);
      });
      app.get("/user/:displayName", async (req, res) => {
        const name = req.params.displayName;
        const userId = { displayName: name };
        try {
          const result = await UserCollection.findOne(userId);
          if (result) {
            res.send(result);
          } else {
            res.status(404).send({ error: "user can't find it" });
          }
        } catch (err) {
          res
            .status(500)
            .send({ error: "an error occurred", details: err.message });
        }
      });
      app.get("/addressAPI", async (req, res) => {
        const address = addressCollection.find();
        const result = await address.toArray();
        res.send(result);
      });
      app.get("/contact", async (req, res) => {
        const contact = contactCollection.find();
        const result = await contact.toArray();

        res.send(result);
      });

      app.get("/address", async (req, res) => {
        const userAddress = userAddressCollection.find();
        const result = await userAddress.toArray();
        res.send(result);
      });
      
      app.get("/address/:user_name", async (req, res) => {
        const userName = req.params.user_name;
        console.log(userName);
        const queryUserName = { user_name: userName };
        try {
          const result = await userAddressCollection.findOne(queryUserName);
          if (result) {
            res.send(result);
          } else {
            res.status(404).send({error:"user can't found"})
          }
        } catch (error){
          res.status(500).send({error:"an error occurred", details: error.message})
        }
      });

      //post api
      app.post("/user", async (req, res) => {
        const user = req.body;
        console.log(user)
        const query = { email: user.email };
        const existingUser = await UserCollection.findOne(query);
        if (existingUser) {
          return res.send({ message: "user already exists" });
        }
        const newUser = {
          displayName:user.displayName,
          phoneNumber:user.phoneNumber,
          profileIDName:user.profileIDName,
          email: user.email,
          role: "customer"
        };  
        console.log("Saving user:", newUser);
        console.log(newUser)
        const result = await UserCollection.insertOne(newUser);
        res.send(result);
      });

      app.post("/address", async (req, res) => {
        const address = req.body;
        const query = { homeAddress: address.homeAddress };
        const existingAddress = await userAddressCollection.findOne(query);
        if (existingAddress) {
          return res.send({ message: "user address already exists" });
        } else {
          const result = await userAddressCollection.insertOne(address);
          res.send(result);
        }
      });
      app.post("/AllProduct",async(req,res)=>{
        const product = req.body;
        const addProduct = await all_productCollection.insertOne(product)
        res.send(addProduct)
      })

      // update api

      app.patch("/user/:displayName", async (req, res) => {
        const { displayName } = req.params;
        const { pictureUrl } = req.body;
        if (!displayName) {
          return res.status(400).json({ message: "displayName is required" });
        }

        if (!pictureUrl) {
          return res.status(400).json({ message: "pictureUrl is required" });
        }
        try {
          const updateUserData = await UserCollection.findOneAndUpdate(
            { displayName: displayName },
            { $set: { pictureUrl: pictureUrl } },
            { new: true, runValidators: true }
          );
          // console.log(updateUserData)
          if (!updateUserData) {
            return res.status(404).json({ message: "user not found" });
          }
          return res.json(updateUserData);
        } catch (error) {
          return res
            .status(500)
            .json({ message: "Error  updating pictureUrl", error });
        }
      });

      app.patch("/user/by-id/:_id", async(req,res)=>{
        const id = req.params._id;
        const {role} = req.body;
        if(!role ||(role !== 'admin' && role !=='customer')){
          return res.status(400).json({error:'Invalid role'})
        }
        
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid user ID" }
          );
        }

        const query = {_id: new ObjectId(id)};
        const updateDoc ={
          $set:{
            role: role,
          }
          
        }
        try{
          const result = await UserCollection.updateOne(query, updateDoc)
          res.send(result)
        }catch{
          res.status(500).json({error:'failed to update role'})
        }
      });

      // Delete api

      app.delete("/address/:_id",async(req,res)=>{
        const id = req.params._id;
        const query = {_id: new ObjectId(id)}
        try{
          const result = await userAddressCollection.deleteOne(query);
          res.send(result)
        }catch (error){
          res.status(500).send({error:'Failed to delete address'})
        }
      })


      
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

  app.get("/", function (req, res) {
    res.send("server is running");
  });

  app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
  });
