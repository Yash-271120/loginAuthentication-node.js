const jwt = require('jsonwebtoken');
const User = require('../model/User');


const auth  = async (req,res,next)=>{
   const token = req.header('auth-token');
   if(!token)return res.status(401).send('Access Denied');


   try {
       const verified = jwt.verify(token,process.env.SECRET);
       const user = await User.findOne({_id:verified._id});
       if(!user)return res.status(401).send('Access Denied');
       next();
   } catch (error) {
       res.status(400).send('Invalid Token')
   }
}

module.exports = auth;