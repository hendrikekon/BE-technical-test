const router = require('express').Router();
const productController = require('./controller');

router.get('/products', productController.show);

router.get('/products/:id', productController.showById);

router.post('/products', productController.store);

router.patch('/products/:id', productController.update);

router.delete('/products/:id', productController.destroy);

module.exports = router;