const dotenv = require('dotenv')
dotenv.config()

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const db = require('./db');
const app = express();

const path = require('path');


const uploadsPath = path.resolve(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));


const corsOptions = {
    origin: [
  'http://localhost:5173',
  'http://luxcycs.com',
  'https://master-of-medical.pages.dev',
  'http://laidarchitecture.com',
  'https://luxcycs.com'
],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
  
  app.use(cors(corsOptions));
  app.use(cookieParser()); 
  
  const testiomonialRoutes = require('./testimonial/routes')
  const blogRoutes = require('./blog/routes')
  const customerRoutes = require('./customers/routes')
  const vendorRoutes = require('./vendors/routes')
  const productRoutes = require('./product/routes')
  const loginRoutes = require('./login/routes')
  const adminUserRoutes = require('./adminUser/routes')
  const cartRoutes = require('./cartItems/routes')
  const orderRoutes = require('./orders/routes')
  const queryRoutes = require('./supportQuery/routes')
  const addressRoutes = require('./address/routes')

  require('./relationship');

  app.use(express.urlencoded({extended: true}));
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
app.use('/admin-user', adminUserRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/support-query', queryRoutes);
app.use('/address', addressRoutes);


db.sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT, console.log('Server is running on port: ' + process.env.PORT));
  });
