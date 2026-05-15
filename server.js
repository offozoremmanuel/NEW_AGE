require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI ).then(()=>{
    console.log('Database connected sucessfully');
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
}).catch((error)=>{
    console.log('Unable to connect:', error.message);
    
})