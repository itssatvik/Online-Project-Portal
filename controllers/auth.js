const User = require('../models/User')
const Job = require('../models/Project')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  
    
    
  let user = await User.findOne({ email: req.body.email });

  if (user) {
    res.render('login', { layout: './layouts/login', userExist: true });
  } else {
    const user = await User.create({ ...req.body });

    const token = user.createJWT();
    res.redirect('/');
    // res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
  }
  

  
}

const login = async (req, res) => {
  
  const { email, password } = req.body

  if (!email || !password) {
    // res.render('login', { layout: './layouts/login', incorrectCred: true });
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    
    // res.render('login', { layout: './layouts/login', incorrectCred: true });
    throw new UnauthenticatedError('User Not Registered');
    
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    res.render('login', { layout: './layouts/login', incorrectCred: true });
    // throw new UnauthenticatedError('Invalid Credentials')
  }

  // compare password
  const token = user.createJWT()
  res.cookie('access_token', token, { httpOnly: true });

  res.redirect('/homepage');
  
  // res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

const logout = async (req, res) => {
  // const token = req.cookies.access_token;
  // console.log((req.cookies.access_token));
  // if (!token) {
  //   throw new UnauthenticatedError('Authentication invalid');
  // }

  try {
    res.clearCookie('access_token');
    res.redirect('/');
  } catch (error) {
    throw new UnauthenticatedError('Logout Error');
  }
};

module.exports = {
  register,
  login,
  logout,
}
