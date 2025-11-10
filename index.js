const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = process.env.SSL_STOR_ID
const store_passwd = process.env.SSL_API
const is_live = false 

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
    const eventCollection = client.db("shop").collection("event");
    const paymentCollection = client.db("shop").collection("payments");

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
    app.get("/AllProduct", async (req, res) => {
      const menCloth = all_productCollection.find();
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
          res.status(404).send({ error: "user can't found" });
        }
      } catch (error) {
        res
          .status(500)
          .send({ error: "an error occurred", details: error.message });
      }
    });

    app.get("/AllProduct/category/:category", async (req, res) => {
      const category = req.params.category;
      const queryCategory = { category: category };
      try {
        const result = await all_productCollection
          .find(queryCategory)
          .toArray();
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ error: "category can't found" });
        }
      } catch (error) {
        res.send({ error: "an error occurred", details: error.message });
      }
    });

    app.get("/AllProduct/detail/:_id", async (req, res) => {
      const id = req.params._id;
      console.log(id);
      const selectItem = { _id: new ObjectId(id) };

      try {
        const result = await all_productCollection.findOne(selectItem);
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ error: "Product not found" });
        }
      } catch (error) {
        res
          .status(500)
          .send({ error: "An error occurred", details: error.message });
      }
    });

    app.get('/AllProduct/single_payment/:_id', async(req,res)=>{
      const id = req.params._id;
      const select_payment_item = { _id: new ObjectId(id)};
      try{
        const result = await all_productCollection.findOne(select_payment_item);
        if(result){
          res.send(result)
        }
      }
      catch(error){
        res .status(500)
      } 
    })

    app.get("/events/", async (req, res) => {
      const event = eventCollection.find();
      const result = await event.toArray();
      res.send(result);
    });

    app.get("/api/payment/", async(req, res)=>{
      const allPayment = paymentCollection.find();
      const result = await allPayment.toArray();
      res.send(result);
    })

    
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email };
      const existingUser = await UserCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists" });
      }
      const newUser = {
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        profileIDName: user.profileIDName,
        email: user.email,
        role: "customer",
      };
      console.log("Saving user:", newUser);
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
    app.post("/AllProduct/", async (req, res) => {
      const product = req.body;
      const addProduct = await all_productCollection.insertOne(product);
      res.send(addProduct);
    });

    app.post("/events/", async (req, res) => {
      const event = req.body;
      const addEvent = await eventCollection.insertOne(event);
      res.send(addEvent);
    });

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
    app.patch("/AllProduct/:_id", async (req, res) => {
      const id = req.params._id;
      const { product_name, main_price, quantity, discount, discount_price } =
        req.body;
      console.log(discount_price);
      const query = { _id: new ObjectId(id) };
      const updateProductInfo = {
        $set: {
          ...(product_name && { product_name }),
          ...(main_price && { main_price }),
          ...(quantity && { quantity }),
          ...(discount && { discount }),
          ...(discount_price && { discount_price }),
        },
      };
      console.log(updateProductInfo);
      const result = await all_productCollection.updateOne(
        query,
        updateProductInfo
      );
      res.send(result);
    });

    app.patch("/user/by-id/:_id", async (req, res) => {
      const id = req.params._id;
      const { role } = req.body;
      if (
        !role ||
        (role !== "admin" &&
          role !== "customer" &&
          role !== "shop owner" &&
          role !== "outlet" &&
          role !== "manager")
      ) {
        return res.status(400).json({ error: "Invalid role" });
      }

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: role,
        },
      };
      try {
        const result = await UserCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch {
        res.status(500).json({ error: "failed to update role" });
      }
    });

    // Delete api

    app.delete("/address/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: new ObjectId(id) };
      try {
        const result = await userAddressCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to delete address" });
      }
    });
    app.delete("/AllProduct/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: new ObjectId(id) };
      try {
        const result = await all_productCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "fail to delete single product" });
      }
    });

    app.delete("/events/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: new ObjectId(id) };
      try {
        const result = await eventCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "fail to delete single event" });
      }
    });




    // payment 
    app.post("/api/payment/init", async (req, res) => {
  const {
    total_amount,
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    product_name,
    cart_items
  } = req.body;

  const tran_id = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  const data = {
    total_amount: parseFloat(total_amount),
    currency: 'BDT',
    tran_id: tran_id,
    success_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/success/${tran_id}`,
    fail_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/fail/${tran_id}`,
    cancel_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/cancel/${tran_id}`,
    ipn_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/ipn`,
    shipping_method: 'Courier',
    product_name: product_name || 'General Products',
    product_category: 'general',
    product_profile: 'general',
    cus_name: customer_name,
    cus_email: customer_email,
    cus_add1: customer_address,
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: customer_phone,
    ship_name: customer_name,
    ship_add1: customer_address,
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };

  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    // Save payment info to database
    const paymentData = {
      tran_id: tran_id,
      customer_name: customer_name,
      customer_email: customer_email,
      customer_phone: customer_phone,
      customer_address: customer_address,
      total_amount: parseFloat(total_amount),
      cart_items: cart_items,
      status: 'pending',
      payment_method: null,
      payment_date: null,
      created_at: new Date()
    };

    await paymentCollection.insertOne(paymentData);

    // Return Gateway URL
    res.json({
      success: true,
      GatewayPageURL: apiResponse.GatewayPageURL,
      tran_id: tran_id
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment initialization failed',
      error: error.message
    });
  }
});

// 2. Payment Success Callback
app.post("/api/payment/success/:tran_id", async (req, res) => {
  const { tran_id } = req.params;

  try {
    // Update payment status in database
    const result = await paymentCollection.updateOne(
      { tran_id: tran_id },
      {
        $set: {
          status: 'success',
          payment_method: req.body.card_type || 'Unknown',
          payment_date: new Date(),
          bank_tran_id: req.body.bank_tran_id,
          card_issuer: req.body.card_issuer,
          val_id: req.body.val_id
        }
      }
    );

    // Redirect to frontend success page
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?tran_id=${tran_id}`);

  } catch (error) {
    console.error('Payment success error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/fail`);
  }
});

// 3. Payment Fail Callback
app.post("/api/payment/fail/:tran_id", async (req, res) => {
  const { tran_id } = req.params;

  try {
    // Update payment status
    await paymentCollection.updateOne(
      { tran_id: tran_id },
      {
        $set: {
          status: 'failed',
          fail_reason: req.body.error || 'Payment failed',
          updated_at: new Date()
        }
      }
    );

    // Redirect to frontend fail page
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/fail?tran_id=${tran_id}`);

  } catch (error) {
    console.error('Payment fail error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/fail`);
  }
});

// 4. Payment Cancel Callback
app.post("/api/payment/cancel/:tran_id", async (req, res) => {
  const { tran_id } = req.params;

  try {
    // Update payment status
    await paymentCollection.updateOne(
      { tran_id: tran_id },
      {
        $set: {
          status: 'cancelled',
          updated_at: new Date()
        }
      }
    );

    // Redirect to frontend cancel page
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel?tran_id=${tran_id}`);

  } catch (error) {
    console.error('Payment cancel error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`);
  }
});

// 5. IPN (Instant Payment Notification) - SSLCommerz callback
app.post("/api/payment/ipn", async (req, res) => {
  const { tran_id, status, val_id } = req.body;

  try {
    // Validate payment with SSLCommerz
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id: val_id });

    if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
      // Update payment status
      await paymentCollection.updateOne(
        { tran_id: tran_id },
        {
          $set: {
            status: 'validated',
            validated_at: new Date(),
            validation_data: validation
          }
        }
      );
    }

    res.status(200).send('IPN received');

  } catch (error) {
    console.error('IPN error:', error);
    res.status(500).send('IPN failed');
  }
});

// 6. Get Payment Status by Transaction ID
app.get("/api/payment/status/:tran_id", async (req, res) => {
  const { tran_id } = req.params;

  try {
    const payment = await paymentCollection.findOne({ tran_id: tran_id });
    
    if (payment) {
      res.json({
        success: true,
        payment: payment
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment status',
      error: error.message
    });
  }
});

// 7. Get All Payments (for admin)
app.get("/api/payments", async (req, res) => {
  try {
    const payments = await paymentCollection.find().sort({ created_at: -1 }).toArray();
    res.json({
      success: true,
      payments: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
});

// 8. Get Payments by Email
app.get("/api/payments/user/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const payments = await paymentCollection
      .find({ customer_email: email })
      .sort({ created_at: -1 })
      .toArray();
    
    res.json({
      success: true,
      payments: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user payments',
      error: error.message
    });
  }
});
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
