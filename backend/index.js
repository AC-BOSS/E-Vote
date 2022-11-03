const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
app.use(cors());

const userRoutes = require('./routes/User');
const pollRoutes = require('./routes/Poll');

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to Database"))
.catch((err) => console.log(err));

app.use(express.json());
app.use('/user', userRoutes);
app.use('/poll', pollRoutes);

app.listen(process.env.PORT, ()=> {
    console.log(`Server started on Port ${process.env.PORT}`)
})