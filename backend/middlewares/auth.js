// const jwt = require('jsonwebtoken')
// const { UnauthenticatedError } = require('../errors')
// const { StatusCodes } = require('http-status-codes')

// const auth = async (req, res, next) => {
  
//     const { istoken, token, purpose, email, password } = req.body

//     if(istoken == false)
//     {
//         next()
//         return
//     }


//     // if (!token.startsWith('Bearer ')) {

//     //     throw new UnauthenticatedError('Unauthenticated')
//     // }


//     // const payload = token.split(' ')[0]
//     const payload = token


//     try {

//         const decoded = jwt.verify(payload, process.env.JWT_SECRET)
        
//         const { mongoID, email } = decoded

//         req.body["mongoID"] =  mongoID
        
//         next()
    
//     } catch (error) {

//         throw new UnauthenticatedError('Not authorized to access this route')
//     }
// }

const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors/index');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      msg: 'Authentication token is missing or malformed',
      isValid: false,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Store the user info in request object for further use
    next();
  } catch (error) {
    return res.status(401).json({
      msg: 'Invalid or expired token',
      isValid: false,
    });
  }
};

module.exports = auth;


