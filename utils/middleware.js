const jwt = require('jsonwebtoken');
const { ACCESS_SECRET, REFRESH_SECRET, generateAccessToken } = require('../utils/jwt');

const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    return generateAccessToken(decoded);
  } catch (err) {
    return null;
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const refreshToken = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
      return next();
    }
    console.log("err.name",err.name);
  
    if (err.name == 'TokenExpiredError' && refreshToken) {
      try {
        const newAccessToken = refreshAccessToken(refreshToken);
        if (!newAccessToken) throw new Error();

        const decodedNewToken = jwt.verify(newAccessToken, ACCESS_SECRET);
        req.user = decodedNewToken;

        res.setHeader('Authorization', `Bearer ${newAccessToken}`);

        return next();
      } catch (refreshErr) {
        return res.status(401).json({ message: 'Refresh failed or expired' });
      }
    }

    return res.status(401).json({ message: 'Invalid or expired access token' });
  });
};

module.exports = {authenticateToken, refreshAccessToken};
