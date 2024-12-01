const{Ability, AbilityBuilder} = require('@casl/ability')

function getToken(req) {
    let token = 
        req.headers.authorization
        ? req.headers.authorization.replace('Bearer ', '')
        : null;
        
        // console.log("Extracted Token:", token);

        return token && token.length ? token : null;
}


// const policyFor = user =>{
//     let builder = new AbilityBuilder();
//     if (user && typeof policies[user.role] === 'function'){
//         policies[user.role](user, builder);
//     }else{
//         policies['guest'](user, builder);
//     }
//     return new Ability(builder.rules);
// }


module.exports = {
    getToken,
}