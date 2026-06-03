const express  = require("express");
const cors = require("cors");
const Pool = require("./config/db")
require("dotenv").config();

const app = express()
app.use(cors(
    {
        origin:'http://localhost:5173',
        credentials:true
    }
));
app.use(express.json());
app.use(express.urlencoded(
    {
        extended: true
    }
));


app.get ("/", (req,res)=>{
    res.send("api is running perfectly");

});


const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`server is running seccessfully on ${port}`);
});