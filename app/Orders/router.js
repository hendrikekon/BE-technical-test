const router = require('express').Router();
const orderController = require('./controller');

router.get('/orders/:id', orderController.showById);

// router.get('/orders', orderController.show);

router.get('/orders', orderController.index);

router.post('/orders', orderController.store);

router.patch('/orders/:id', orderController.update);

router.delete('/orders/:id', orderController.destroy);

module.exports = router;