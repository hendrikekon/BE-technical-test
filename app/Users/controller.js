const Users = require('./model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const {getToken} = require('../../utils');

const register = async(req, res, next) => {
    try{
        const payload = req.body;
        let users = new Users(payload);
        await users.save();
        return res.status(200).json({
            message: 'User registered successfully',
            users
        });

    }catch(err){
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        res.status(500).send(error);
        next(err);
    }
}

const localStrategy = async (us_email, us_password, done) =>{
    try{
        console.log('Received email:', us_email);
        console.log('Received password:', us_password);
        let user = await Users
        .findOne({us_email: us_email})
        .select('-__v -createdAt -updatedAt -token');
        
        if(!user) return done(null, false, { message: 'Incorrect email or password' });

        const passwordMatch = bcrypt.compareSync(us_password, user.us_password);
        if (passwordMatch) {
            const { us_password, ...userWithoutPassword } = user.toJSON();
            return done(null, userWithoutPassword);
        } else {
            return done(null, false, { message: 'Incorrect email or password local' });
        }
    }catch(err){
        done(err, null);
    }
    done();
}

// const localStrategy = async (us_email, us_password, done) => {
//     try {
//         console.log('Received email:', us_email);
//         console.log('Received password:', us_password);
//       const user = await Users.findOne({ us_email }).select('-__v -createdAt -updatedAt -token');
  
//       if (!user) {
//         console.error('User not found for email:', us_email);
//         return done(null, false, { message: 'Incorrect email or password' });
//       }
  
//       const isMatch = await bcrypt.compare(us_password, user.us_password);
  
//       if (isMatch) {
//         const { us_password, ...userWithoutPassword } = user.toJSON();
//         return done(null, userWithoutPassword);
//       } else {
//         console.error('Incorrect password for user:', us_email);
//         return done(null, false, { message: 'Incorrect email or password' });
//       }
//     } catch (err) {
//       console.error('Error during authentication:', err);
//       return done(err, false);
//     }
//   };

const show = async(req, res, next) => {
    try {
        let {skip = 0, limit = 10, } = req.query;
        let users = await Users.find()
            .skip(parseInt(skip))
            .limit(parseInt(limit));
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error);
        error(next)
    }
};

const me = (req, res, next) => {

    if(!req.user){
        res.json({
            err: 1,
            message: `You're not login or token expired`
        })
    }
    res.json(req.user);
}

const login  = async (req, res, next) => {
    passport.authenticate('local', async function(err, user, info){
        if(err) return next(err);
        if(!user) return res.status(401).json({error: 1, message: info.message || 'login Email or Password is incorrect'});
        
        try {
            let signed = jwt.sign(user, config.secretkey);
            await Users.findByIdAndUpdate(user._id, {$push: {token: signed}});

            return res.status(200).json({
                message: 'Login successful',
                user,
                token: signed
            });
        } catch (error) {
            return next(err);
        }
        
    })(req, res, next);
}



const logout = async (req, res, next) => {
    let token = getToken(req);
    
    if(!token){
        return res.status(400).json({
            error: 1, 
            message: 'Token not provided!!!'
        });
    }

    let user = await Users.findOneAndUpdate({token: {$in: [token]}}, {$pull: {token: token}}, {useFindAndModify: false});

    if (!user) {
        return res.status(400).json({
            error: 1,
            message: 'No User Found!!!'
        });
    }

    return res.status(200).json({
        error: 0, 
        message: 'User Logged Out Successfully'
    })
}

const update = async(req, res, next) => {
    try {
        const {id} = req.params;
        let updateData = req.body;
        let users = await Users.findByIdAndUpdate(id, updateData, {new: true});
        if (users){
            return res.status(200).json(users);
        }else{
            return res.status(404).json({error: 1, message: 'users not found'});
        }
    } catch (error) {
        res.status(500).send(error);
        error(next)
    }
}
const destroy = async(req, res, next) => {
    try {
        const {id} = req.params;
        let users = await Users.findByIdAndDelete(id);
        if (users){
            return res.status(200).json({message: 'users deleted successfully'});
        }else{
            return res.status(404).json({error: 1, message: 'users not found'});
        }
    } catch (error) {
        res.status(500).send(error);
        error(next);
    }
};

module.exports = {
    register,
    localStrategy,
    login,
    logout,
    me,
    show,
    update,
    destroy,
};