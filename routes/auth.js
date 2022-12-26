const router= require('express').Router();
const User=require('../models/User');
const CryptoJS=require('crypto-js');
const jwt=require('jsonwebtoken');
//REGISTER
router.post('/register',(req,res)=>{
    const newUser= new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString()
    });
    newUser.save()
    .then(()=>{
        res.status(201).json({
            message: 'Successfully registered'
        })
        console.log(newUser)
    })
    .catch((err)=>{
        console.log(err)
    })
});

//LOGIN
router.post('/login',async(req,res)=>{ 
    try{
        const user= await User.findOne(
            {username: req.body.username}
            );
        !user && res.status(401).json('Wrong credentials');
        const hashedPassword= CryptoJS.AES.decrypt(
            user.password,
             process.env.PASSWORD_SECRET
             );
        const OriginalPassword= hashedPassword.toString(CryptoJS.enc.Utf8);
        OriginalPassword !==req.body.password && res.status(401).json('Wrong credentials');

        const accessToken= jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        },process.env.JWT_SECRET_KEY,
        {expiresIn:'1d'}
        );
        const {password, ...others}= user._doc;
        res.status(200).json({...others,accessToken});
    }catch (err){
        res.status(500).json(err)
    } 
})

module.exports= router;