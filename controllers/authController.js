const User = require ('../models/User')
const CustomError = require('../errors')
const{StatusCodes} = require ('http-status-codes')
const {attachCookiesToResponse} = require ('../utils')

// Register route 

const register = async (req, res)=> {
  const { email, password , name } = req.body ;
  const emailAlreadyExist = await User.findOne({email})
  if (emailAlreadyExist){
    throw new CustomError.BadRequestError(' email already exists bro ...')
  }
  const isFirstAccount = await User.countDocuments({}) === 0 ;
  const role = isFirstAccount ? 'admin': 'user';
  const user = await User.create({name , email , password ,role }); 

  const tokenUser = {name:user.name , userId :user._id , role : user.role}
  attachCookiesToResponse({res, user:tokenUser})
 
  res.status(StatusCodes.CREATED).json({user:tokenUser })
}


// Login route 
const login = async (req, res)=> {
    const {email,  password} = req.body ; 
    if (!email || !password ){
      throw new CustomError.BadRequestError(' please provide email and password ')
    
    }
  const user = await User.findOne ({email})
  if( !user){
  throw new CustomError.UnauthenticatedError('Invalid credentials ')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if(!isPasswordCorrect){
    throw new CustomError.UnauthenticatedError('Invalid credentials ')
  }
   const tokenUser = {name:user.name , userId :user._id , role : user.role}
  attachCookiesToResponse({res, user:tokenUser})
 
  res.status(StatusCodes.CREATED).json({user:tokenUser })
  
  }


  //logout route 
  const logout  = async (req, res)=> {
    res.cookie ('token', '', {
      httpOnly: true , 
      expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg : "you're just logged out bro ..."})
  }

module.exports = { register, login , logout}