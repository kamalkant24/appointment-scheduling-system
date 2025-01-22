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
const { UnauthenticatedError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const auth = async (req, res, next) => {
  // Extract the Authorization header (Bearer token)
  const authHeader = req.headers.authorization;

  // If no Authorization header or not in "Bearer token" format, return an error
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Authentication token is missing or malformed',
      isValid: false,
    });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  try {
    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store the decoded user ID (mongoID) and other data in req object for further use
    req.user = decoded;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    // If the token is invalid or expired
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Invalid or expired token',
      isValid: false,
    });
  }
};




module.exports = auth;


