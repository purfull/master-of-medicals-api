const Customer = require('./customers/model');
const Cart = require('./cart/model');
const CartItem = require('./cartItems/model');
const Address = require('./address/model');
const Product = require('./product/model');

Customer.hasOne(Cart, { foreignKey: 'customerId' });
Cart.belongsTo(Customer, { foreignKey: 'customerId' });

Customer.hasMany(Address, { foreignKey: 'customerId' });
Address.belongsTo(Customer, { foreignKey: 'customerId' });

Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });
