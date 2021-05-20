// require install moudels
const express = require('express');
const router = express.Router();

// require app files
const { ensureAuthenticated, forwardAuthenticated, checkGoogleAuth } = require('../config/auth');
const indexController = require('../controllers/indexController');

//localhoast:5000/
router.get('/', forwardAuthenticated, indexController.index);

//localhoast:5000/dashboard
router.get('/dashboard', ensureAuthenticated, checkGoogleAuth, indexController.dashboard);

router.post('/newsletter', indexController.newsletter);

// Contact form
router.get('/contact', indexController.contact);
router.post('/contact', indexController.sendContact)

//get product pages
router.get('/men_shirt', indexController.mshirt);
router.get('/men_jean', indexController.mjean);
router.get('/men_shoes', indexController.mshoes);
router.get('/men_accessry', indexController.maccess);
router.get('/women_fabric', indexController.wfabric);
router.get('/women_jewelry', indexController.wjewelry);
router.get('/women_shoes', indexController.wshoes);
router.get('/women_accessry', indexController.waccess);
router.get('/kid_outwear', indexController.koutwear);
router.get('/kid_toys', indexController.ktoy);
router.get('/kid_shoes', indexController.kshoes);
router.get('/kid_accessry', indexController.kaccess);

//get single product
router.get('/single_product', indexController.singleproduct);

//get about page
router.get('/about', indexController.about)

//get cart page
router.get('/cart', indexController.cart)



//export router
module.exports = router;