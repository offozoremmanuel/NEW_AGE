const express = require('express');
require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 6677;
const passport =require('passport')
const customerRoute = require('./routes/customer');
const orderRouter = require('./routes/order')
const axios = require('axios');
const productRoutes= require('./routes/product');
const categoryRoutes = require('./routes/category')
const cart = require('./routes/cart')
const paymentRoutes = require('./routes/payment')
const deliveryRoutes = require('./routes/delivery')
require('./middleware/passport')
const expressSession = require('express-session')


const app = express();
app.use(express.json());
app.use(cors());
app.use(expressSession({
    secret: 'emmanuel',
    resave: true,
    saveUninitialized: true
}))
app.use (passport.initialize())
app.use (passport.session())




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





const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc')
const rateLimiter = require('./middleware/rateLimiter')

app.use('/api/v1/order', orderRouter);
app.use( '/api/v1/customer', customerRoute);
app.use('/api/v1/product', productRoutes)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/cart', cart)
app.use('/api/v1/payment', paymentRoutes)
app.use('/api/v1/delivery', deliveryRoutes)



const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'New Age API Documentation',
    version: '2.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',

    license: {
      name: 'Official URL',
      url: 'https://google.com',
    },

    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },

    servers: [
    {
      url: 'https://new-age-59we.onrender.com',
      description: 'hosted Development server',
    },
    {
      url: 'http://localhost:6677',
      description: 'Development server',
    },
  ],
  
  security: [
    {
      bearerAuth: []
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
  
};


const options = {
    swaggerDefinition,
    apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJsdoc(options);

app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec))



app.use((req, res, next) => {
    next({
                message: `route ${req.originalUrl} and ${req.method} not found`,
                statusCode: 500
            })
})

app.use((error, req, res, next) => {
    console.log(error.message || error)
    res.status(error.statusCode || 500).json({
        message: 'something went wrong',
        status: error.statusCode || 500
    })
})


const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Database connected successfully');

  app.listen(PORT, ()=> {
    console.log(`Server listening to Port: ${PORT}`);
})
    
})
.catch((error) => {
    console.log(error.message);
    
})
    
