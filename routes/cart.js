const router= require('express').Router();
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}= require('./verifyToken');
const Cart= require('../models/Cart')
const CryptoJS= require('crypto-js')

//CREATE PRODUCTS
router.post('/',verifyToken, async (req,res)=>{
    const newCart= new Cart(req.body);
    try{
        const savedCart= await newCart.save();
        res.status(200).json(savedProduct);
    }
    catch(Err){
        res.status(500).json(Err);
    }
})

//UPDATE PRODUCTS
router.put('/:id',verifyTokenAndAuthorization,async(req,res)=>{
    try{
        const updatedCart= await Cart.findByIdAndUpdate(
            req.params.id,
            {
            //$set: req.body
        },{new:true});
        res.status(200).json(updatedCart)
    }catch(err){
        res.status(500).json(err)
    }
});

router.delete('/:id',verifyTokenAndAuthorization, async(req,res)=>{
    try{
        await Cart.findByIdAndDelete(
            req.params.id,
            res.status(200).json('Successfully deleted  ')
        )
    }catch(err){
        res.status(500).json(err)
    }
});

router.get('/find/:userId',verifyTokenAndAuthorization ,async(req,res)=>{
    try{
        const cart= await Cart.findOne({userId:req.params.id});
        res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err)
    }
})

router.get('/',verifyTokenAndAdmin,async(req,res)=>{
    try{
        const carts= await Cart.find();
        res.status(200).json(carts)
    }catch(Error){
        res.status(500).json(Error);
    }
})
module.exports= router;