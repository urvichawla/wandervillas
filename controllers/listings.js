const Listing=require("../models/listing.js");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// module.exports.index=async (req,res)=>{
//     const allListings=await Listing.find({})
//         //console.log(res);
//         res.render("listings/index.ejs",{allListings});

    
//   }

module.exports.showhomepage=(req,res)=>{
  res.render("listings/index.ejs");
}
module.exports.index = async (req, res) => {
  const { country } = req.query;
  let query = {};
  if (country) {
    query.country = country;
  }
  const allListings = await Listing.find(query);
  res.render("listings/index.ejs", { allListings });
}

  module.exports.rendernewform=(req,res)=>{
    //console.log(user);
    
    res.render("listings/new.ejs")

  }
  module.exports.showlisting=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{
      path: "author",
    }}).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested doest not exist");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});

  }
  module.exports.createListing=async (req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
      .send();
      //console.log(response.body.features[0].geometry);
     // res.send("done");
      
    




    let url=req.file.path;
    let filename=req.file.filename;
    //console.log(url,"..",filename);
    //let {title,description,image,price,country,location}=rq.body;
   
    
 
      const newlisting= new Listing(req.body.listing);
      newlisting.owner=req.user._id;
      newlisting.image={url,filename};
      newlisting.geometry=response.body.features[0].geometry;
     
    let savedlisting=await newlisting.save();
    console.log(savedlisting);

    req.flash("success","new listing created successfully");
    //console.log(listing);
    res.redirect("listings");

      
    

  }
  module.exports.rendereditform=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested doest not exist");
      res.redirect("/listings");
    }
    let originalimageurl=listing.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalimageurl});
  
  };
  // module.exports.updatelisting=async (req,res)=>{
  //   let {id}=req.params;

   

    
 
    
  //   let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
  //   if(typeof req.file!=="undefined"){
  //   let url=req.file.path;
  //   let filename=req.file.filename;
  //   listing.image={url,filename};
  //   await listing.save();
  //   }
  //   req.flash("success","Listing updated");
  //   res.redirect(`/listings/${id}`);
  // };
  module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;
  
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested does not exist");
      res.redirect("/listings");
    }
  
    const newLocation = req.body.listing.location;
    if (newLocation && newLocation !== listing.location) {
      let response = await geocodingClient.forwardGeocode({
        query: newLocation,
        limit: 1,
      }).send();
      listing.geometry = response.body.features[0].geometry;
      listing.location = newLocation;
    }
  
    listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }
  
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
  };
  module.exports.destroylisting=async (req,res)=>{
    let {id}=req.params;
    let deletelist=await Listing.findByIdAndDelete(id);
    console.log(deletelist);
    req.flash("success","listing deleted successfully");
    res.redirect("/listings");

  };