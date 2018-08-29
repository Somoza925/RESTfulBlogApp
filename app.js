var bodyParser      = require("body-parser"),
methodOverride      = require("method-override"),
expressSanitizer    = require("express-sanitizer"),
mongoose            = require("mongoose"),
express             = require("express"), 
app                 = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");    // connects/makes a database
app.set("view engine", "ejs");                               // allow express to use ejs
app.use(express.static("public"));                           // custom style sheet
app.use(bodyParser.urlencoded({extended: true}));   
app.use(expressSanitizer()); // must be after body-parser
app.use(methodOverride("_method")); // THIS ALLOWS THE FORM TO USE THE PUT REQUEST


// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}  //allows the created data to be of type DATE and its default value is now
})
var Blog = mongoose.model("Blog", blogSchema);



// RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){ // blog.find finds all the blogs inside, blogs is all fo the blogs found
        if (err){
            console.log("ERROR");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
})
// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
})

// CREATE ROUTE
app.post("/blogs", function (req, res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    
    Blog.create(req.body.blog, function(err, newBlog){ // Node creates an objext with req.body.blog
        if (err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
    // then, rerdirect to the index
});
// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});
// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function (req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body); // makes sure to clean out script tags!
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    })
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});



var port = process.env.PORT || 2312;
app.listen(port, function(){
    console.log('The blog server has started on ' + port+'!!!!');
}); 