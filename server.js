const dotenv = require('dotenv')
dotenv.config()

const express = require('express');
const cors = require('cors');


const db = require('./db');
require('./relationship');
const app = express();

const path = require('path');


const uploadsPath = path.resolve(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));


const corsOptions = {
    origin: '*',
    methods: '*', 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
  
  app.use(cors(corsOptions));
  
  const testiomonialRoutes = require('./testimonial/routes')
  const blogRoutes = require('./blog/routes')
  const customerRoutes = require('./customers/routes')
  const vendorRoutes = require('./vendors/routes')
  const loginRoutes = require('./login/routes')
  const productRoutes = require('./product/routes')
  
  app.use(express.urlencoded({extended: false}));
  app.use(express.json());
  app.set('view engine', 'pug');
  

app.get('/check',(req, res) => {
    res.send("Working !!")  
})

app.use('/customer', customerRoutes);
app.use('/vendor', vendorRoutes);
app.use('/product', productRoutes);
app.use('/testimonial', testiomonialRoutes);
app.use('/blog', blogRoutes);
app.use('/user', loginRoutes);


db.sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT, console.log('Server is running on port: ' + process.env.PORT));
  });
