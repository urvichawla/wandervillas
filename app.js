if(process.env.NODE_ENV!="production"){

require('dotenv').config();

}
//console.log(process.env.SECRET);
const express=require("express");
const app=express();


const path=require("path");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const mongoose=require("mongoose");
const flash=require("connect-flash");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded ({extended:true}));
app.use(methodOverride("_method"));
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const user=require("./routes/user.js");
app.engine('ejs', ejsMate);

async function main() {
    //await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    await mongoose.connect(process.env.ATLASDB_URL);

  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }
  main().then(()=>{
    console.log("connected to mongodb");
  })
  // app.get("/",(req,res)=>{
  //   res.send("server connected");
  // });
  
  const store=MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,

    crypto:{
      secret:process.env.SECRET,

    },
    touchAfter: 24*3600,
  }

  );
  store.on("error",()=>{
    console.log("error in mongo session store",err);
  })
  const sessionoptions={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7*24*60*60*1000,
      maxAge: 7*24*60*60*1000,
      httpOnly: true,

    }
  }
  
  app.use(session(sessionoptions));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  

  app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
   // console.log(res.locals.success)
    next();

  })
  // app.get("/demouser",async (req,res)=>{
  //   let fakeuser=new User({
  //     email: "student@gmail.com",
  //     username: "delta-student",
  //   })
  //   let registereduser=await User.register(fakeuser,"helloworld");
  //   res.send(registereduser);
  // })
 
  app.use("/listings",listings);
  app.use("/listings/:id/reviews",reviews);
  app.use("/",user);

  
  // app.get("/listings",wrapAsync(async (req,res)=>{
  //   const allListings=await Listing.find({})
  //       //console.log(res);
  //       res.render("listings/index.ejs",{allListings});

    
  // }));
  // app.get("/listings/new",(req,res)=>{
  //   res.render("listings/new.ejs")

  // });
  // app.get("/listings/:id", wrapAsync(async(req,res)=>{
  //   let {id}=req.params;
  //   const listing=await Listing.findById(id).populate("reviews");
  //   res.render("listings/show.ejs",{listing});

  // }))
  //app.post("/listings",validateListing, wrapAsync(async (req,res,next)=>{
    //let {title,description,image,price,country,location}=rq.body;
    
 
     // const newlisting= new Listing(req.body.listing);
     
   // await newlisting.save();
    //console.log(listing);
   // res.redirect("listings");

      
    

  //}));
  // app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
  //   let {id}=req.params;
  //   const listing=await Listing.findById(id);
  //   res.render("listings/edit.ejs",{listing});
  
  // }))
  // app.put("/listings/:id", validateListing,wrapAsync(async (req,res)=>{
  //   if(!req.body.listing){
  //     throw new ExpressError(400,"send valid data for listing")
  //   }
    
 
  //   let {id}=req.params;
  //   await Listing.findByIdAndUpdate(id,{...req.body.listing});
  //   res.redirect(`/listings/${id}`);
  // }))
  // app.delete("/listings/:id", wrapAsync(async (req,res)=>{
  //   let {id}=req.params;
  //   let deletelist=await Listing.findByIdAndDelete(id);
  //   console.log(deletelist);
  //   res.redirect("/listings");

  // }))
  //review
  // app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
  //   let listing =await Listing.findById(req.params.id);
  //   let newReview=new Review(req.body.review);
  //   listing.reviews.push(newReview);
  //   await newReview.save();
  //   await listing.save();
  //   res.redirect(`/listings/${listing._id}`);
  

  // }))
  //delete review rout
  // app.delete("/listings/:id/reviews/:reviewid",wrapAsync(async(req,res)=>{
  //   let {id,reviewid}=req.params;
  //   await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
  //   await Review.findByIdAndDelete(reviewid);
  // }))
   app.all("*",(req,res,next)=>{
     next(new ExpressError(404,"page not found!"))
   })
  app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    console.error(err.stack);
    res.status(statusCode).render("error.ejs",{err});
   // res.status(statusCode).send(message);

 })
//   app.get("/testlisting", async (req,res)=>{
//     let samplelisting=new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India"
//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successfull testing");


//   });
app.listen(8080,()=>{
    console.log("server is listening");
});