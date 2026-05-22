require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.PORT;
const customerRoute = require('./routes/customer');
const {passport} = require('./middleware/passport')
const expressSession = require('express-session')

const app = express();
app.use(express.json());

app.use(expressSession({
    secret: 'emmanuel',
    resave: true,
    saveUninitialized: true
}))
app.use (passport.initialize())
app.use (passport.session())

app.use('/api/v1/customer', customerRoute);


app.use((err, req, res,next) => {
    if(err.name === 'TokenExpiredError'){
        return res.status(401).json({
            message: 'session expired: please login to continue'
        })
     }
     if(err.name === 'MulterError'){
        return res.status(400).json({
            message: err.message
        })
     }
    console.log(err.message)
    res.status(500).json({
        message: 'something went wrong'
     })
})
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    })
})

mongoose.connect(process.env.MONGODB_URI ).then(()=>{
    console.log('Database connected sucessfully');
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
}).catch((error)=>{
    console.log('Unable to connect:', error.message);
    
})
