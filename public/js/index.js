function listPosts() {
	$.ajax({
		url: "/blog-posts",
		//data : OBJECT WITH PARAMETERS
		method: 'GET',
		dataType: 'json', //TYPE OF DATA TO BE RECIEVED
		//ContentType: TYPE OF DATA TO BE SENT TO THE API
		success: function(responseJSON){
					console.log(responseJSON);

					$("#blogPosts").empty();

					for (let post of responseJSON) {
						$("#blogPosts").append("<div class='post'><h3>" + post.title + "</h3><h6>By: " + post.author + ", " + post.publishDate.substring(0,10) + "</h6><p>" + post.content + "</p><p>ID: " + post.id + "</p></div>");
					}

				},
		error: function(err){
					console.log(err);
					//$("#dogImages").html(`<li>Something went wrong. Try again later</li>`);
				}
	});

}

$("#postForm").on("submit", function(event){
	event.preventDefault();
	
	if ($("#dateP").val() == "")
		createPost($("#titleP").val(), $("#authorP").val(), $("#contentP").val(), "");
	else
		createPost($("#titleP").val(), $("#authorP").val(), $("#contentP").val(), $("#dateP").val());
});

function createPost(title2, author2, content2, date) {
	let obj = {
			title: title2,
			content: content2,
			author: author2,
			publishDate: date
		};

	$.ajax({
		url: "/blog-posts",
		data: JSON.stringify(obj),
		method: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		success: function(responseJSON) {
			$("#sPost").text("");
			$(listPosts);
		},
		error: function(err) {
			$("#sPost").text(err.statusText);
		}
	});
}

function deletePost(id) {
	$.ajax({
		url: "/blog-posts/" + id,
		method: 'DELETE',
		dataType: 'json',
		success: function(responseJSON) {
			$("#dPost").text("");
			$(listPosts);
		},
		error: function(err) {
			$("#dPost").text(err.statusText);
		}
	});
}

$("#delForm").on("submit", function(event) {
	event.preventDefault();

	let empty;

	if ($("#idD").val() != "")
		deletePost($("#idD").val());
	else
		deletePost(empty);
	$("#idD").val("")
});

$("#upForm").on("submit", function(event){
	event.preventDefault();

	let emptyID;
	let newDate = "";
	if ($("#dateU").val() != "") {
		newDate = $("#dateU").val();
	}

	if ($("#idU").val() != "")
		updatePost($("#idU").val(), $("#titleU").val(), $("#authorU").val(), $("#contentU").val(), newDate);
	else
		updatePost(emptyID, $("#titleP").val(), $("#authorP").val(), $("#contentP").val(), newDate);
});

function updatePost(idU, title2, author2, content2, date) {
	let obj = {
			id: idU,
			title: title2,
			content: content2,
			author: author2,
			publishDate: date
		};

	$.ajax({
		url: "/blog-posts/" + idU,
		data: JSON.stringify(obj),
		method: 'PUT',
		dataType: 'json',
		contentType: 'application/json',
		success: function(responseJSON) {
			$("#uPost").text("");
			$(listPosts);
		},
		error: function(err) {
			$("#uPost").text(err.statusText);
		}
	});
}

$(listPosts);