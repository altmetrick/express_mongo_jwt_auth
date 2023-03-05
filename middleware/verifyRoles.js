const ROLES_LIST = require('../config/roles-list');

//use verifyRoles middleware after verifyJWT middleware
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    //check for user object on req (watch verifyJWT.js middleware)
    if (!req.user?.roles) {
      return res.status(404);
    }
    //allowedRoles = [5150 , 1984] // verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor)
    //res.user.roles = [2001] // user role

    //check if user has a roles that provided for a route
    const userRoles = req.user.roles;
    const result = userRoles
      .map((role) => allowedRoles.includes(role))
      .find((val) => val === true);

    if (!result) {
      return res.status(401).json({ error: `Forbidden!` });
    }
    next();
  };
};

module.exports = verifyRoles;

//logic to show allowed roles in error message

// const ROLES_LIST = {
//   admin: 5150,
//   editor: 1984,
//   user: 2001,
// };

// const verifyRoles = (...allowedRoles) =>{
//   //allowedRoles = [5150, 1984]

//   const reqRoles = 2001

//   let msg1 = ''

//   for (const key in ROLES_LIST){
//     if(allowedRoles.includes(ROLES_LIST[key])){
//       msg1 += ` ${key},`
//     }
//   }

//   return `Allowed only for roles: ${msg1}!`
// }

// verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor)
