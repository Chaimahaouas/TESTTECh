const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();
const config = require('config');
const cors= require('cors');
app.use(cors());
const jwtSecret = config.get('jwtSecret');
console.log(config.get('jwtSecret'));
const port = process.env.PORT || 3000;
app.use(express.json());



// connection
mongoose.connect('mongodb://localhost:27017/formBuilder')
.then(() => console.log('connected...'))
.catch(err => console.error('could not connect', err));


const formsRouter = require('./routes/Forms');
app.use('/api/forms', formsRouter);

const UserRouter=require("./routes/User");

app.use('/api/user',UserRouter)

const PageRouter=require ('./routes/Pages');
app.use('/api/pages',PageRouter);
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
