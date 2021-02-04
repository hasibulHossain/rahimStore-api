const express = require('express');
const shopController = require('../controller/shop');
// const { body } = require('express-validator')

//local import

const router = express.Router();

//  GET /feed/posts/
router.get('/products', shopController.getProducts);
router.get('/product/:productId', shopController.getProduct);

// POST requrest
router.post('/product', shopController.addProduct);

// // PUT request
router.put('/product/:productId', shopController.editProduct)

// // DELETE requrest

router.delete('/product/:productId', shopController.deleteProduct);


module.exports = router;