var express = require("express");
var app = express();
var mongoose=require("mongoose");
mongoose.Promise= require("bluebird");
var bodyParser=require("body-parser");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");
var User = require("./user");
var passport= require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var adminLoggedIn= false;
//app conig
mongoose.connect("mongodb://localhost/spec_surgery_app");
app.set("view engine","ejs");
app.use(require("express-session")({
    secret : "specube is my first company name",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//moongose/model config
var fraudSchema=new mongoose.Schema({
    title: String,
    hospital: String,
    location: String,
    diseases: String,
    image: String,
    body: String,
    created:{type: Date , default:Date.now}
});
 var Fraud=mongoose.model("Fraud",fraudSchema);
var hospitalSchema= new mongoose.Schema({
    name: String,
    location: String,
    image: String,
    icuRent: String,
    generalRent: String,
    surgery:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Surgery"
    }],
    facilities: Number,
    minQualification: Number,
    minExp: Number,
    yearOfEstablishment: Number,
//    frauds:[
//        {
//            type:mongoose.Schema.Types.ObjectId,
//            ref:"Fraud"
//        }
//    ]
    noOfFrauds: Number
    
});
var Hospital=mongoose.model("Hospital",hospitalSchema);
var surgerySchema=new mongoose.Schema({
        disease: String,
        cost: Number,
        successRate: Number,
        casualities: Number
    
});
var Surgery=mongoose.model("Surgery",surgerySchema);
//routes
app.get("/", function(req, res) {
  res.render("index",{currentUser: req.user});
});
//spec-compare routes
app.get("/compare",function(req,res){
    Hospital.find({},function(err,hospitals){
               if(err){
                   console.log(err);
               } else{
                    res.render("compare",{hospitals:hospitals});
               }
    });
  
});
app.get("/clinic",function(req,res){
   res.render("clinic"); 
});
app.get("/secret",isLoggedIn,function(req,res){
   res.send("secret page !!!");
});
//show signup page
app.get("/register",function(req,res){
    res.render("register");
});
//handling user sign up
app.post("/register",function(req,res){
    User.register(new User({username: req.body.username }),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
           res.redirect("/") 
        });
    });
});
//login route
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login"
}),function(req,res){
    
});
//logout
app.get("/logout",function(req,res){
   req.logout();
    res.redirect("/");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticate()){
        return next();
    }
    res.redirect("/login");
}
// admin panel
app.get("/admin",function(req,res){
    
    res.render("admin");
});
app.post("/admin",function(req,res){
   if(req.body.admin.username=='sakar'&&req.body.admin.password=='jainsakar')
       {
           adminLoggedIn= true;
           res.redirect("/admin/hospitals");
           
       }
    else{
        res.redirect("/admin");
    }
});
//hospital routes
app.get("/admin/hospitals",function(req,res){
    if(adminLoggedIn){
            Hospital.find({},function(err,hospitals){
               if(err){
                   console.log(err);
               } else{
                    res.render("hospital",{hospitals:hospitals});
               }
            });
    }else{
        res.redirect("/admin");
    }
     
});
//new form
app.get("/admin/hospitals/new",function(req,res){
    if(adminLoggedIn){
        res.render("newhosp");
    }else{
        res.redirect("/admin");
    }
  
});
app.post("/admin/hospitals",function(req,res){
    if(adminLoggedIn){
        Hospital.create(req.body.hospital,function(err,newhospital){
            if(err){
                res.render("newhosp");
            }else{

                res.redirect("/admin/hospitals");
            }
        }); 
    }else{
         res.redirect("/admin");
    }
    
});
//show route for hospital
app.get("/admin/hospitals/:id",function(req, res) {
    if(adminLoggedIn){
        Hospital.findById(req.params.id).populate("surgery").exec(function(err,foundhospital){
              if(err){
                  console.log(err);
                  res.redirect("/");
              } else{
                  res.render("showhosp",{hospital:foundhospital});
              }
        });
    }else{
         res.redirect("/admin");
    }
  //find the specific hospital
  
});
//edit route for hospital
app.get("/admin/hospitals/:id/edit",function(req,res){
    if(adminLoggedIn){
        Hospital.findById(req.params.id,function(err,foundhospital){
              if(err){
                  res.redirect("/");
              } else{
                  res.render("edithosp",{hospital:foundhospital});
              }
          });
    }else{
        res.redirect("/admin");
    }
    
});
//update route for hospital
app.put("/admin/hospitals/:id",function(req,res){
    if(adminLoggedIn){
        Hospital.findByIdAndUpdate(req.params.id,req.body.hospital,function(err,updatedhospital){
              if(err){
                  res.redirect("/admin/hospitals");
              }else{
                  res.redirect("/admin/hospitals/"+req.params.id);
              }
          }) ;
    }else{
        res.redirect("/admin");
    }
  

});
//delete route for hospital
app.delete("/admin/hospitals/:id",function(req,res){
    if(adminLoggedIn){
        Hospital.findByIdAndRemove(req.params.id,function(err,updatedhospital){
             if(err){
                 res.redirect("/admin/hospitals");
             } else{
                res.redirect("/admin/hospitals"); 
             }
          });
    }else{
        res.redirect("/admin");
    }
      
});
//surgery routes new form
app.get("/admin/hospitals/:id/surgery/new",function(req,res){
    if(adminLoggedIn){
            Hospital.findById(req.params.id, function(err, hospital){
                if(err) {
                    console.log(err);
                } else {
                    res.render("newsur", {hospital: hospital});        
                }
            }); 
    }else{
         res.redirect("/admin");
    }
   
});
//post 
app.post("/admin/hospitals/:id/surgery",function(req,res){
    if(adminLoggedIn){
        Hospital.findById(req.params.id, function(err, hospital){
            if(err) {
                console.log(err);
                res.redirect("/admin/hospitals");
            } else {
                Surgery.create(req.body.surgery, function(err, newsurgery){
                    if(err){
    //                    req.flash("error", "Something went wrong!");
                        console.log(err);
                    } else {
    //                    comment.author.id = req.user._id;
    //                    comment.author.username = req.user.username;
                        newsurgery.save();
                        hospital.surgery.push(newsurgery);
                        hospital.save();
    //                    req.flash("success", "Successfully added comment");
                        res.redirect("/admin/hospitals/" + hospital._id);
                    }
                });
            }
        }); 
    }else{
        res.redirect("/admin");
        
    }
   
});
//delete route for surgery
app.delete("/admin/hospitals/:id/surgery/:surgeryId",function(req,res){
    if(adminLoggedIn){
        Surgery.findByIdAndRemove(req.params.surgeryId,function(err,updatedsurgery){
             if(err){
                 res.redirect("/admin/hospitals");
             } else{
                res.redirect("/admin/hospitals"); 
             }
          });
    }else{
        res.redirect("/admin");
    }
      
});
var ids=[];
var minId=undefined;

var myMap= new Map();
var sortedMap= new Map();
//==========FILTER==============
app.post("/filter",function(req,res){
    var flag=0;
    var effective_cost=0;

    var min=999999999;

     Hospital.find({},function(err,hospitals){
               if(err){
                   console.log(err);
               } else{
//                    res.render("hospital",{hospitals:hospitals});
                   hospitals.forEach(function(hospital){
                        ids[flag]=hospital._id; 
                        flag=flag+1;
                   });
               }
            });
    setTimeout(function(){
          ids.forEach(function(id){
        Hospital.findById(id).populate("surgery").exec(function(err,foundhospital){
          if(err){
              console.log(err);
              res.redirect("/");
          } else{
              foundhospital.surgery.forEach(function(surgery) {
                        if(surgery.disease==req.body.surgeries){
                            if(req.body.Treatment=='best'){
                                console.log("best");
                                effective_cost=(3*(foundhospital.noOfFrauds/(2018-foundhospital.yearOfEstablishment)))-(5*foundhospital.facilities)-(5*surgery.successRate)-(1.5*(2018-foundhospital.yearOfEstablishment))-(1.5*foundhospital.minExp)-(1.1*foundhospital.minQualification)+(2*surgery.casualities);
                                console.log(foundhospital.name);
                                console.log(effective_cost);
                                if(effective_cost<min)
                                {
                                    min=effective_cost;
                                    minId=foundhospital._id;
                                }
//                                myMap.set(effective_cost,id);

                            }
                            if(req.body.Treatment=='least'){
                                console.log("least");
                                effective_cost=(6*surgery.cost*100000)+(0.8*(foundhospital.noOfFrauds/(2018-foundhospital.yearOfEstablishment)))-
                                (0.8*foundhospital.facilities)-(0.6*surgery.successRate)-(1*(2018-foundhospital.yearOfEstablishment))-(0.6*foundhospital.minExp)-(0.6*foundhospital.minQualification)+(1*surgery.casualities);
                                console.log(foundhospital.name);
                                console.log(effective_cost);
                                if(effective_cost<min)
                                {
                                    min=effective_cost;
                                    minId=foundhospital._id;
                                }
                            }
                              if(req.body.Treatment=='average'){
                                console.log("average");
                                effective_cost=(1*surgery.cost*100)+(1*(foundhospital.noOfFrauds/(2018-foundhospital.yearOfEstablishment)))-(2*foundhospital.facilities)-(2.5*surgery.successRate)-(2*(2018-foundhospital.yearOfEstablishment))-(1.5*foundhospital.minExp)-(1.2*foundhospital.minQualification)+(1.2*surgery.casualities);
                                  console.log(foundhospital.name);
                                console.log(effective_cost);
                                if(effective_cost<min)
                                {
                                    min=effective_cost;
                                    minId=foundhospital._id;
                                }
//                                myMap.set(effective_cost,id);

                            }
//                                myMap.set(effective_cost,id);

                            }

                        
              });
              
//                            
//                        }
             
             
              
          }
      });
    });    
    },3000)
  setTimeout(function(){
      var counter=false;
    if(minId){
        counter=true;
    }
    if(counter==true)
        {console.log(minId);
         console.log(effective_cost);
            counter=false;
                 Hospital.findById(minId).populate("surgery").exec(function(err,foundhospital){
                  if(err){
                      console.log(err);
                      res.redirect("/");
                  } else{
                      minId=undefined;
                      res.render("filter",{hospital: foundhospital});
                  }
                     
            }); 
            

        }
  },4000)
    

});
app.get('/filter/:id',function(req,res){
    Hospital.findById(req.params.id).populate("surgery").exec(function(err,foundhospital){
      if(err){
          console.log(err);
          res.redirect("/");
      } else{
          res.render("filterhosp",{hospital:foundhospital,currentDisease: req.body.surgeries});
      }
  });
});
app.get("/frauds",function(req,res){
    
       Fraud.find({},function(err,frauds){
       if(err){
           console.log(err);
       } else{
            res.render("fraud",{frauds:frauds});
       }
    });
});
//new fraud
app.get("/frauds/new",function(req,res){
    res.render("new");
});
//creat a new fraud
app.post("/frauds",function(req,res){
    req.body.fraud.body=req.sanitize(req.body.fraud.body);
    Fraud.create(req.body.fraud,function(err,newfraud){
        if(err){
            res.render("new");
        }else{
            res.redirect("/frauds");
        }
    });
});

//show particular fraud
app.get("/frauds/:id",function(req, res) {
  //find the specific fraud
  Fraud.findById(req.params.id,function(err,foundfraud){
      if(err){
          console.log(err);
          res.redirect("/");
      } else{
          res.render("show",{fraud:foundfraud});
      }
  });
});    
//edit page
app.get("/frauds/:id/edit",function(req,res){
    Fraud.findById(req.params.id,function(err,foundfraud){
      if(err){
          res.redirect("/");
      } else{
          res.render("edit",{fraud:foundfraud});
      }
  });
});
app.put("/frauds/:id",function(req,res){
        req.body.fraud.body=req.sanitize(req.body.fraud.body);

  Fraud.findByIdAndUpdate(req.params.id,req.body.fraud,function(err,updatedfraud){
      if(err){
          res.redirect("/frauds");
      }else{
          res.redirect("/frauds/"+req.params.id);
      }
  }) ;

});
app.delete("/frauds/:id",function(req,res){
      Fraud.findByIdAndRemove(req.params.id,function(err,updatedfraud){
         if(err){
             res.redirect("/frauds");
         } else{
            res.redirect("/frauds"); 
         }
      });
});
app.get("/barcharts",function(req,res){
    Fraud.find({},function(err,frauds){
       if(err){
           console.log(err);
       } else{
            res.render("barchart",{frauds:frauds});
       }
    });
});
app.listen(3000, function() {
  console.log("working!!!!");
});
