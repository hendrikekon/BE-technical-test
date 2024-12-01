const router = require('express').Router();
const usersController = require('./controller');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({usernameField:'us_email', passwordField: 'us_password'}, usersController.localStrategy))

router.post('/register', usersController.register);

router.post('/login', usersController.login);

router.post('/logout', usersController.logout);

router.get('/me', usersController.me);

router.get('/users', usersController.show);

router.patch('/users/:id', usersController.update);

router.delete('/users/:id', usersController.destroy);

module.exports = router;