const shopRouter = require('express').Router()
const ShopItem = require('../models/shopItem')
const jwt = require('jsonwebtoken')



// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET); // Use process.env.SECRET
    req.user = decoded; // Attach user information to request object
    next(); // Move to the next middleware
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};


shopRouter.get('/', verifyToken, async (request, response) => {
  const shopItems = await ShopItem.find({}).catch(() => []);
  response.json(shopItems);
});


shopRouter.post('/buy/:itemId', verifyToken, async (request, response) => {
  const { itemId } = request.params;

  const item = await ShopItem.findById(itemId);
  if (!item) {
    return response.status(404).json({ error: 'Item not found' });
  }

  if (item.soldOut) {
    return response.status(400).json({ error: 'Item is sold out' });
  }

  // TODO: service after buy

  res.json({ message: 'Item purchased successfully', item });
});


// init shop item - hard coding
shopRouter.post('/shopitems', async (request, response) => {
  const { name, image, soldOut, currency, price, attack } = request.body;

  const newItem = new ShopItem({
    name,
    image,
    soldOut,
    currency,
    price,
    attack
  });

  newItem.save()
    .then(savedItem => {
      response.status(201).json(savedItem);
    })
    .catch(error => response.status(400).json({ error: 'Failed to add new item' }));
});





module.exports = shopRouter