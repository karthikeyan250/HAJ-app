const express=require('express');
const Router=express.Router();
const bcrypt=require('bcryptjs');
const flash=require('connect-flash');
const session =require('express-session');
const User=require('../models/Users');
const passport=require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']


Router.get('/login',forwardAuthenticated, (req,res)=>res.render("login"));
Router.get('/register',forwardAuthenticated, (req,res)=>res.render("worker/register"));//worker register
Router.get('/clientregister',forwardAuthenticated, (req,res)=>res.render('client/register'));//client register

Router.post('/register', (req,res)=>{
const {name,email,password,password2,mobno,work,active,role} =req.body;
let  errors=[];

if(!name||!email||!password||!password2||!mobno||!work||!active)
{
    errors.push({msg:'Please fill in all fields'});
}
if(password!==password2)
{
    errors.push({msg:'password does not match'});
}
if(password.length<6){
    errors.push({msg:'Password must be atleast 6 characters'});
}
if(errors.length>0){
    res.render('worker/register', {errors,name,email,password,password2});
}

else {
    User.findOne({email:email})
    .then(user=>{
        if(user){
            errors.push({msg:'Email already exists'});
          res.render('worker/register',{
              errors,
              email,
              password,
              password2,
              mobno,
              work,
              role
          });      
    }
    else{
        const newUser=new User({
            name:name,
            email:email,
            password:password,
            mobile:mobno,
            worksknown:work,
            active:active,
            role:role //hidden
        });

        saveCover(newUser,req.body.cover)    //saving the image

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  });
  
//ClientRegister POST method
Router.post('/clientregister', (req,res)=>{
  const {name,email,password,password2,mobno,work,active,role} =req.body;
  let  errors=[];
  
  if(!name||!email||!password||!password2||!mobno)
  {
      errors.push({msg:'Please fill in all fields'});
  }
  if(password!==password2)
  {
      errors.push({msg:'password does not match'});
  }
  if(password.length<6){
      errors.push({msg:'Password must be atleast 6 characters'});
  }
  if(errors.length>0){
      res.render('client/register', {errors,name,email,password,password2});
  }
  
  else {
      User.findOne({email:email})
      .then(user=>{
          if(user){
              errors.push({msg:'Email already exists'});
            res.render('client/register',{
                errors,
                email,
                password,
                password2,
                mobno
            });      
      }
      else{
          const newUser=new User({
              name:name,
              email:email,
              password:password,
              mobile:mobno,
              worksknown:work,
              active:active,
              role:role //hidden

          });
  
          saveCover(newUser,req.body.cover)    //saving the image
  
          bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    req.flash(
                      'success_msg',
                      'You are now registered and can log in'
                    );
                    res.redirect('/users/login');
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        });
      }
    });


  Router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
      })(req, res, next);
    });

    Router.get('/logout', (req, res) => {
        req.logout();
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
      });
       
      function saveCover(newUser,coverEncoded){
        if(coverEncoded ==null) return
        const cover=JSON.parse(coverEncoded)
        if(cover !=null && imageMimeTypes.includes(cover.type)){
          newUser.coverImage=new Buffer.from (cover.data,'base64')
          newUser.coverImageType=cover.type
        }

        
      }



module.exports=Router