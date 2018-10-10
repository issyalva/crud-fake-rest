$(document).ready( function() {

	albumGrid();
	button_add_album();

    /**************************
    ALBUMS 'NAV'
    **************************/
    // add new album
    $(document).on("click", "#add-album-button", function() {
        createNewAlbum();
    });
    
    // back to album
    $(document).on("click", "#back-to-album-button", function(){
        button_add_album();
		reload_AlbumGrid();
    });

    // load all albums
    $(document).on("click", "#all-albums-button", function(){
    	selectedClass = "all";
        button_add_album();
		reload_AlbumGrid();
		authorList();
    });

});



/*******************************
	INITIAL ALBUMS GRID
*******************************/
function albumGrid(){

	$("#albums").html("<div class='cell'><p>Loading...</p></div>");
	album_html = "";

	$.getJSON("https://jsonplaceholder.typicode.com/users").done( function(users_data){
		$.getJSON("https://jsonplaceholder.typicode.com/albums").done( function(albums_data){
			$.each(albums_data, function(key, album){
				$.each(users_data, function(key, user){
					if ( user.id === album.userId ){
						album_html += "<div id='element' class='cell large-4 medium-4 filter-" + album.userId +  " all' data-id='" + album.id + "'>"
						album_html += "<div class='album-wrapper radius'>";
						album_html += "<h5>" + album.title + "</h5>";
						album_html += "<p>By: " + user.name + "</p>";
						album_html += "<div class='button-group'>";
						album_html += "<button type='button' id='view-photos-button' class='button radius small round hollow' data-id='" + album.id + "' data-author-id='" + album.userId + "'>";
						album_html += "<i class='step fi-thumbnails'></i></button> ";
						// edit
						album_html += "<button type='button' data-open='Modal_Reveal' class='button radius warning small update-album-button round hollow' data-author-id='" + album.userId + "' data-id='" + album.id + "'>";
						album_html += "<i class='step fi-pencil'></i></button> ";
						// delete
						album_html += "<button type='button' data-open='Modal_Reveal' class='button alert radius small delete-album-button round hollow' data-author-id='" + album.userId + "' data-id='" + album.id + "'>";
						album_html += "<i class='step fi-trash'></i></button>";
						album_html += "</div></div>";
						album_html += "</div>";
					}
				}); // each user
				$("#albums").html(album_html);
			}); // each album
		}); // get albums
	}); // get users
};



/*******************************
	RELOAD ALBUMS GRID EFFECTS
*******************************/
function reload_AlbumGrid() {

	const fadeAlbums = function() {
		$("#albums>div").not("."+selectedClass).fadeTo(100,0);
		$("#albums").fadeTo(100, 0);
	};

	const reloadAlbums = function() {
		setTimeout( function(){
			albumGrid();
		}, 101);
	};
	// 'selectedClass' to be defined when function called
	$.when(  fadeAlbums(), reloadAlbums() ).always(function(){
		$("#albums").fadeTo(500, 1, function() {
			$("#albums>div").not("."+selectedClass).hide();
		});
	});

};



/*******************************
	ADD ALBUM BUTTON
*******************************/
function button_add_album() {
	create_album_button = "";
	create_album_button += "<button id='add-album-button' class='button radius small' data-open='Modal_Reveal' type='button'>";
	create_album_button += "<i class='step fi-plus'></i> Add Album</button> ";
	$("#albums-nav").html(create_album_button);
}



/**********************
	CALL OUT BOX
**********************/
 function call_out_album(action) {
 	album_call_out = "";
	album_call_out += "<div class='callout success' data-closable>";
	album_call_out += "<p>Album has been " + action + "</p>";
	album_call_out += "<button class='close-button' aria-label='Dismiss alert' type='button' data-close>";
	album_call_out += "<span aria-hidden='true'>&times;</span>";
	album_call_out += "</button>";
	album_call_out +=  "</div>";
	$("#album-callout").html(album_call_out);
}

// also used in photos-functions.js
function call_out_fail() {
 	callout_fail = "";
	callout_fail += "<div class='callout alert' data-closable>";
	callout_fail += "<p>There was an error</p>";
	callout_fail += "<button class='close-button' aria-label='Dismiss alert' type='button' data-close>";
	callout_fail += "<span aria-hidden='true'>&times;</span>";
	callout_fail += "</button>";
	callout_fail +=  "</div>";
	$("#album-callout").html(callout_fail);
}



/*******************************
	CREATE / ADD NEW ALBUM
*******************************/
function createNewAlbum(){

	$("#Modal_Reveal").html("<div class='cell'><p>Loading...</p></div>");

	$.getJSON("https://jsonplaceholder.typicode.com/users").done( function(users_data){
		// AUTHOR SELECT OPTIONS
		author_select_options = "";
		author_select_options += "<select name='userId' class='form-control'>";
		$.each(users_data, function(key, user){
		    author_select_options += "<option value='" + user.id + "'>" + user.name + "</option>";
		});
		author_select_options += "</select>";
		// FORM HTML
		create_album_form = "";
		create_album_form += "<form id='create-album-form' class='cell' action='#' method='post' border='0'>";
		create_album_form += "<div class='cell'> <h4> Create Album </h4> <hr></div>";
		// name field
		create_album_form += "<div class='medium-12 cell'>";
		create_album_form += "<label>Album Title <input type='text' name='title' class='form-control' required /> </label>";
		create_album_form += "</div>";
		// author list
		create_album_form += "<div class='medium-12 cell'>";
		create_album_form += "<label>Author";
		create_album_form += author_select_options + "</label>";
		create_album_form += "</div>";
		// button to submit form / cancel
		create_album_form += "<div class='medium-12 cell'>";
		create_album_form += "<button type='submit' class='button radius success'>";
		create_album_form += " Create Album </button> ";
		create_album_form += " <button data-close aria-label='Close modal' class='button radius secondary' type='button' >";
		create_album_form += " Cancel </button>";
		create_album_form += "</div> </form>";

		$("#Modal_Reveal").html(create_album_form);
	});

};

/******************************
	POST DATA / ON CLICK SUBMIT NEW ALBUM FORM
/******************************/
$(document).on("submit", "#create-album-form", function(){

	selectedClass = "all";
	button_add_album();
	var form_data = JSON.stringify($(this).serializeObject());

	$.ajax({
		url: "https://jsonplaceholder.typicode.com/albums",
		method : "POST",
		contentType : "application/json",
		data : form_data
	})
	.done(function(){
		call_out_album("created");
	})
	.fail(function(jqXHR, textStatus, errorThrown){
		call_out_fail();
		console.log(textStatus + ": " + errorThrown);
	})
	.always(function(){
		$("#Modal_Reveal").foundation("close");
		authorList();
		reload_AlbumGrid();
	});
	return false;
});



/*******************************
	EDIT / UPDATE ALBUM DATA
*******************************/
$(document).on("click", ".update-album-button", function(){

	$("#Modal_Reveal").html("<div class='cell'><p>Loading...</p></div>");
	const id = $(this).attr("data-id");
	const album_author_id = $(this).attr("data-author-id");

	$.getJSON("https://jsonplaceholder.typicode.com/albums/" + id).done( function(album){
		var title = album.title;
		var albumId = album.id;
		var author = album.userId;
		$.getJSON("https://jsonplaceholder.typicode.com/users").done( function(users_data){
			// AUTHOR SELECT OPTIONS
			author_select_options = "";
			author_select_options += "<select name='userId' class='form-control'>";
			$.each(users_data, function(key, users){
				if (users.id === author) {
				author_select_options += "<option value='" + users.id + "' selected>" + users.name + "</option>";
				} else {
				author_select_options += "<option value='" + users.id + "'>" + users.name + "</option>";
				}
			});
			author_select_options += "</select>";
			// FORM
			edit_album_form = "";
			edit_album_form += "<form id='update-album-form' class='cell' data-rel='filter-" + album_author_id + "' action='#' method='post' border='0'>";
			edit_album_form += "<div class='cell'> <h4> Update Album </h4> <hr></div>";
			// title
			edit_album_form += "<div class='cell'>";
			edit_album_form += "<label>Album Title ";
			edit_album_form += "<input value='" + title + "' type='text' name='title' class='form-control' required />";
			edit_album_form += "</label></div>";
			// author
			edit_album_form += "<div class='cell'>";
			edit_album_form += "<label>Author ";
			edit_album_form += author_select_options;
			edit_album_form += "</label></div>";
			// album
			edit_album_form += "<div class='cell hide'>";
			edit_album_form += "<label>Album Id ";
			edit_album_form += "<input value='" + albumId + "' type='number' min='1' name='id' class='form-control' required type='hidden'/>";
			edit_album_form += "</label></div>";
			// buttons
			edit_album_form += "<div class='cell'>";
			edit_album_form += "<button type='submit' data-rel='filter-"+album_author_id+"' data-author-id='filter-"+album_author_id+"' class='button radius success'>";
			edit_album_form += " Update Album </button> ";
			edit_album_form += " <button type='button' data-close aria-label='Close modal' class='button radius secondary'>";
			edit_album_form += " Cancel </button>";
			edit_album_form += "</div> </form>";

			$("#Modal_Reveal").html(edit_album_form);
		}); // get users
	}); // get albums

	/******************************
	ON SUBMIT - UPDATE ALBUM FORM
	/******************************/
	$(document).on("submit", "#update-album-form", function(){

		selectedClass = $('#update-album-form').attr('data-rel');
		var form_data=JSON.stringify($(this).serializeObject());

		$.ajax({
			url: "https://jsonplaceholder.typicode.com/albums/" + id,
			method : "PATCH",
			contentType : "application/json",
			data : form_data
		})
		.done(function(){
			call_out_album("updated");
		})
		.fail(function(jqXHR, textStatus, errorThrown){
			call_out_fail();
			console.log(textStatus + ": " + errorThrown);
		})
		.always(function(){
			$("#Modal_Reveal").foundation("close");
			button_add_album();
			reload_AlbumGrid();
		});
		return false;
	});
});




/*******************************
	DELETE ALBUM
*******************************/
$(document).on("click", ".delete-album-button", function(){

	$("#Modal_Reveal").html("<div class='cell'><p>Loading...</p></div>");
	const id = $(this).attr("data-id");
	const usr = $(this).attr("data-author-id");

	$.getJSON("https://jsonplaceholder.typicode.com/albums/"+ id).done( function(albums_data) {
		delete_album_modal = "";
		delete_album_modal += "<div class='cell'> <h4> Delete Album </h4> <hr>";
		delete_album_modal += "<p> Are you sure you want to delete the album <i>" + albums_data.title + "</i>?</p> </div>";
		delete_album_modal += '<div class="button-group">';
		delete_album_modal += "<button id='confirm-delete-album' data-rel='filter-"+usr+"' data-author-id='" + usr + "' class='close-buttons button alert radius confirm-delete-album' type='button'>" ;
		delete_album_modal += " Confirm Delete</button> " ;
		delete_album_modal += " <button class='close-buttons button secondary radius' data-close aria-label='Close modal' type='button'>" ;
		delete_album_modal += " Cancel </button>" ;
		delete_album_modal += "</div>";

		$("#Modal_Reveal").html(delete_album_modal);
	});

	/******************************
	CONFIRM DELETE SUBMIT
	/******************************/
	$(document).on("click", "#confirm-delete-album", function(){

		selectedClass = $(this).attr("data-rel");

		$.ajax({
			url: "http://jsonplaceholder.typicode.com/albums/" + id,
			method : "DELETE",
			dataType : "json",
			data : JSON.stringify({ id: id })
		})
		.done(function(){
			call_out_album("deleted");
		})
		.fail(function(jqXHR, textStatus, errorThrown){
			call_out_fail();
			console.log(textStatus + ": " + errorThrown);
		})
		.always(function(){
			$("#Modal_Reveal").foundation("close");
			reload_AlbumGrid();
		});
		return false;
	});
});
