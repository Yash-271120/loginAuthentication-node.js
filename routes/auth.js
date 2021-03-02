const router = require('express').Router();
const User = require('../model/User'); 
const {registerValidation,loginValidation} = require('../validation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')








router.post('/register',async (req,res)=>{
    
    //validating
    const data = req.body
   const {error} = registerValidation(data);
   if(error) return res.status(400).send(error.details[0].message);


   //if user exists already
   const emailExits = await User.findOne({email:data.email});
   if(emailExits) return res.status(400).send('Email already exists');
  
  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(data.password,salt);

    // create new user
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (error) {
        res.status(400).send('Server Error')
    }
});


//login
router.post('/login',async (req,res)=>{


  //validating
  const data = req.body
  const {error} = loginValidation(data);
  if(error) return res.status(400).send(error.details[0].message);



    //if user exists already
    const user = await User.findOne({email:data.email});
    if(!user) return res.status(400).send('Email is incorrect');
    
    //password comparison
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('Password is incorrect');
   

    //create and assign a token
    const token = jwt.sign({_id:user._id},process.env.SECRET);
    res.header('auth-token',token).send(token);
})










module.exports = router;
