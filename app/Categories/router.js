const router = require('express').Router();
const catetoriesController = require('./controller');

router.get('/categories', catetoriesController.show);

router.post('/categories', catetoriesController.store);

router.patch('/categories/:id', catetoriesController.update);

router.delete('/categories/:id', catetoriesController.destroy);

module.exports = router;