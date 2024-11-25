const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config()

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors())
app.use(express.urlencoded({extended:true}))

require('./initDB')()

const useRouters = require('./routers/userRouter')
app.use('/users',useRouters) 
///http://localhost:9000/users

const PORT = 9000 || process.env.PORT
app.listen((PORT), ()=>{
    console.log(`Server is running in the PORT of ${PORT}`)
})