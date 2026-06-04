const {Pool} = require('pg');
require('dotenv').config();

const pool =  new Pool (
    {
    user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
    }
);
pool.on('connect', ()=>{
 console.log(" database connection successful ");
})
pool.on('error', (err)=>{
  console.log(" database error occured---", err);
})


pool.query("SELECT NOW()", (err,res)=>{
    if (err){
        console.log("database connection failed--",err);

    }
    else{
        console.log("execution sucessful");
    }
})
module.exports= pool;
