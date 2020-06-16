const express=require('express');
const Router=express.Router();
const User=require('../models/Users');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

Router.get('/', (req,res) => res.render('welcome'));

//Worker or client dashboard 
Router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    if(req.user.role=='client')
    {
        res.render('client/dashboard')
}
   else{ 
       res.render('worker/dashboard',{
        name:req.user.name
   
    })
}
})

Router.post('/dashboard',ensureAuthenticated,async (req,res)=>{
    
   let user
   console.log('dashboard');
   
   console.log(req.body)
   console.log(req.user.id)
   try{
      // user=await User.findById(req.user.id)
      req.user.active=req.body.active
      //user.active=req.user.active
       await req.user.save()
       console.log('dashboard page updated');
       res.redirect('/dashboard');
       
   }catch{
       res.redirect('/')
   }

})

   

Router.get('/dashboard/edit',ensureAuthenticated,(req,res)=>{
    if(req.user.role=="worker")
    {
    console.log('dashboard edit page');
    res.render('worker/edit',{
        phonenumber:req.user.mobile,
        active:req.user.active,
        worksknown:req.user.worksknown,
        photo:req.user.coverImagePath 
    });
}
else{
    res.send('You are not authorized');
}
})

//Worker Dashboard edit
Router.post('/dashboard/edit',ensureAuthenticated,async (req,res)=>{
    try{
        req.user.mobile=req.body.mobno
        req.user.active=req.body.active
        req.user.worksknown=req.body.work
        await req.user.save()
        console.log('edit page updated');
        res.redirect('/dashboard');
       
   }catch{
       res.redirect('/')
   }


   

})
module.exports=Router