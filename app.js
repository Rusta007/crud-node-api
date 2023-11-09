const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 8000;

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://jp9016161598:0000@cluster0.dpfgavs.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const dataSchema = new mongoose.Schema({
  userId: Number,
  fname: String,
  lname: String,
  address: String,
  mobileno: Number,
  gender: String,
  language: [String],
  image : String
});

const Data = mongoose.model("Data", dataSchema);

app.use(bodyParser.json());

app.get("/api/get", async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/data", async (req, res) => {
  const newData = new Data(req.body);
  console.log(req.body)

  try {
    const savedData = await newData.save();
    res.json(savedData);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Bad Request" });
  }
});

app.delete("/api/delete/:userId", async (req, res) => {
  try {
    const deletedData = await Data.findOneAndDelete({ userId: req.params.userId });
    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.json(deletedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.put("/api/update/:userId", async (req, res) => {
  console.log(req.params.userId);
  try {
    const updatedData = await Data.findOneAndUpdate({ userId: req.params.userId }, req.body, {
      new: true,
    });
    if (!updatedData) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.json(updatedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
