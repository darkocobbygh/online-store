const router= require('express').Router();
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}= require('./verifyToken');
const Order= require('../models/Order')
const CryptoJS= require('crypto-js')

//CREATE PRODUCTS
router.post('/',verifyToken, async (req,res)=>{
    const newOrder= new Order(req.body);
    try{
        const savedOrder= await newOrder.save();
        res.status(200).json(savedOrder);
    }
    catch(Err){
        res.status(500).json(Err);
    }
})

//UPDATE PRODUCTS
router.put('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try{
        const updatedOrder= await Order.findByIdAndUpdate(
            req.params.id,
            {
            //$set: req.body
        },{new:true});
        res.status(200).json(updatedOrder)
    }catch(err){
        res.status(500).json(err)
    }
});

router.delete('/:id',verifyTokenAndAdmin, async(req,res)=>{
    try{
        await Order.findByIdAndDelete(
            req.params.id,
            res.status(200).json('Successfully deleted  ')
        )
    }catch(err){
        res.status(500).json(err)
    }
});

router.get('/find/:userId',verifyTokenAndAuthorization ,async(req,res)=>{
    try{
        const order= await Order.find({userId:req.params.id});
        res.status(200).json(order)
    }catch(err){
        res.status(500).json(err)
    }
})

router.get('/',verifyTokenAndAdmin,async(req,res)=>{
    try{
        const orders= await Cart.find();
        res.status(200).json(orders)
    }catch(Error){
        res.status(500).json(Error);
    }
});

//GET MONTHLY INCOME
router.get('/income',verifyTokenAndAdmin,async(req,res)=>{
    const date= new Date();
    const lastMonth= new Date(date.setMonth(date.getMonth()-1));
    const previousMonth= new Date(new Date().setMonth(lastMonth.getMonth()-1));
    try{
        const income= await Order.aggregate([
            {$match:{createdAt:{$gte:previousMonth}}},
            {
                $project:{
                    month:{$month: 'createdAt'},
                    sales:'$amount'
                }
            },
            {
                $group: {
                    _id:'$month',
                    total: {$sum: '$sales'}
                }
            }
        ]);
        res.status(200).json(income);
    }
    catch(Error){
        res.status(500).json(Error)
    }
})
module.exports= router;