const express= require('express');
const mongoose=require('mongoose');
const dotenv= require('dotenv').config();
const userRoutes=require('./routes/user');
const bodyParser= require('body-parser');
const authRoute=require('./routes/auth');
const productRoute= require('./routes/product');

const app=express();
//FIXING STRICTQUERY
mongoose.set('strictQuery', true);

//Create a variable for database
const dbURI= process.env.MONGO_URL;

//Connect Database
mongoose.connect(dbURI,{UseNewUrlParser: true, UseUnifiedTopology: true})
.then(()=>{
    console.log('Connected to Database successfully')
})
.catch((err)=>{
    console.log(err);
})

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use('/api/auth',authRoute);
app.use('/api/users',userRoutes);
app.use('/api/products',productRoute);
app.listen(process.env.PORT || 3000,()=>{
    console.log('Greetings from server');
})