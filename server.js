let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let app = express();
let jsonParser = bodyParser.json();
let uuid = require("uuid");

const {DATABASE_URL, PORT} = require('./config')
let { BlogPostList } = require('./blog-post-model');
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(morgan("dev"));

let blogPosts = [
	{
		id: uuid.v4(),
		title: "first post",
		content: "this is the first one",
		author: "me",
		publishDate: "23/10/2019"
	},
	{
		id: uuid.v4(),
		title: "second post",
		content: "this is the second one",
		author: "juan",
		publishDate: "23/10/2019"
	},
	{
		id: uuid.v4(),
		title: "third post",
		content: "this is the third one",
		author: "pedro",
		publishDate: "23/10/2019"
	}
];

app.get("/blog-posts", (req, res, next) =>{
	BlogPostList.getAll()
		.then( blogPosts => {
			return res.status(200).json(blogPosts);
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with the DB. Try again later.",
				status: 500
			});
		})
});

app.get("/blog-post", (req, res, next) =>{
	if (!req.query.author){
		res.statusMessage = "Author is missing in params";
		return res.status(406).json({
			status: 406,
			message: "Author is missing in params"
		});
	}

	for (let post of blogPosts) {
		if (post.author == req.query.author){
			return res.status(200).json(post);
		}
	}

	res.statusMessage = "Name of author doesn't exist";
	return res.status(404).json({
		status: 404,
		message: "Name of author doesn't exist"
	});

});

app.post("/blog-posts", jsonParser, (req, res) =>{
	let newPost = {
		id: uuid.v4(),
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	}

	if (newPost.title == "" || newPost.content  == "" || newPost.author  == "" || newPost.publishDate  == "") {
		res.statusMessage = "Missing parameter(s)";
		return res.status(406).json({
			status: 406,
			message: "Missing parameter(s)"
		});
	}

	BlogPostList.post(newPost)
		.then(post => {
			return res.status(201).json({
				message: "BlogPost added to the list", 
				status: 201, 
				blogPost : post
			});
		})
		.catch(error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with the DB. Try again later.",
				status: 500
			});
		})
});

app.delete("/blog-posts/:id", (req, res) =>{
	let id = req.params.id;

	BlogPostList.deleteById(req.params.id)
		.then( post => {
			if(!post) {
				res.statusMessage = "Blog-post id not found on the list";
				return res.status(404).json({
					message: "Blog-post id not found on the list",
					status: 404
				});
			}
			return res.status(200).json(post);
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with the DB. Try again later.",
				status: 500
			});
		})
});

app.put("/blog-posts/:id", jsonParser, (req, res) =>{
	if (!req.body.id) {
		res.statusMessage = "Missing Id in body";
		return res.status(406).json({
			status: 406,
			message: "Missing Id in body"
		});
	}

	if (req.body.id != req.params.id) {
		res.statusMessage = "Id in params doesn't match the one in the body";
		return res.status(409).json({
			status: 409,
			message: "Id in params doesn't match the one in the body"
		});
	}

	let newPost = {
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	}

	BlogPostList.getById(newPost.id)
		.then(post => {
			if(!post) {
				res.statusMessage = "Post id not found on the list";
				return res.status(404).json({
					message: "Post id not found on the list",
					status: 404
				});
			}

			if(newPost.title == "")
				newPost.title = post.title;
			if(newPost.author == "")
				newPost.author = post.author;
			if(newPost.content == "")
				newPost.content = post.content;
			if(newPost.publishDate == "")
				newPost.publishDate = post.publishDate;

			BlogPostList.updatePost(newPost)
				.then(updatedPost => {
					if(!updatedPost) {
						res.statusMessage = "Post id not found on the list";
						return res.status(404).json({
							message: "Post id not found on the list",
							status: 404
						});
					}

					return res.status(200).json(updatedPost);
				})
				.catch( error => {
					res.statusMessage = "Something went wrong with the DB. Try again later.";
					return res.status(500).json({
						message: "Something went wrong with the DB. Try again later.",
						status: 500
					});
				})

		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with the DB. Try again later.",
				status: 500
			});
		})
});

let server;
function runServer(port, databaseUrl) { //function to run when the server starts
	return new Promise((resolve, reject) => {
		mongoose.connect( databaseUrl, error => { //the 'error' parameter is only going to be holding
			if(error){							  //something when an error is triggered
				return reject(error);
			}

			server = app.listen(port, ()=> {
				console.log("Something is going on on port " + port);
				resolve();
			})
		})
	})
}

function closeServer(){
	 return mongoose.disconnect()
	 .then(() => {
	 	return new Promise((resolve, reject) => {
	 		console.log('Closing the server');
			server.close( err => {
				 if (err){
				 	return reject(err);
				 }
				 else{
				 	resolve();
				 }
			 });
	 	});
	 });
}

runServer(PORT, DATABASE_URL)
	.catch(error => {
		console.log(error);
	});

module.exports = {app, runServer, closeServer};

