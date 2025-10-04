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
  const bannerRoutes = require('./banner/routes')
  const offerBannerRoutes = require('./offerbanner/routes')
  const brandRoutes = require('./brand/routes')
  const reviewRoutes = require('./productReview/route')

  require('./relationship');

  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  app.set('view engine', 'pug');
  

app.get('/check',(req, res) => {
    res.send("Working !!")
})
const refToken = require('./utils/middleware')
app.get('/get-auth-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token found' });
  }

  const newAccessToken = refToken.refreshAccessToken(refreshToken);

  if (!newAccessToken) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  // Optionally: Set it as a cookie
  // res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });

  return res.status(200).json({ accessToken: newAccessToken });
});



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
app.use('/banner', bannerRoutes);
app.use('/offer-banner', offerBannerRoutes);
app.use('/brand', brandRoutes);
app.use('/review', reviewRoutes);


db.sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT, console.log('Server is running on port: ' + process.env.PORT));
  });
