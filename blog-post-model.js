let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let blogPostSchema = mongoose.Schema({
	id : {type: String},
	title: {type: String},
	author: {type: String},
	content: {type: String},
	publishDate: {type: Date}
});

let BlogPost = mongoose.model('BlogPost', blogPostSchema);

let BlogPostList = {
	getAll: function(){
		return BlogPost.find()
			.then(blogPosts => {
				return blogPosts;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	getById : function(pId) {
		return Student.findOne({id : pId})
			.then(post => {
				return post;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	post: function(newPost){
		return BlogPost.create(newPost)
			.then(post => {
				return post;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	deleteById: function(pId) {
		return BlogPost.findOneAndRemove({id:pId})
			.then(post => {
				return post;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	updatePost: function(newPost) {
		return BlogPost.findOneAndReplace({id:newPost.id}, newPost, {returnNewDocument:true})
			.then(post => {
				return post;
			})
			.catch(error => {
				throw Error(error);
			})
	}

}

module.exports = {BlogPostList};