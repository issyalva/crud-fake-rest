/*******************************
	DISPLAY PHOTOS IN ALBUM
*******************************/
$(document).on("click", "#view-photos-button", function(){

	const id = $(this).attr("data-id");
    const album_author_id = $(this).attr("data-author-id");

    reload_Photos(id);

    setTimeout( function() {
		view_albums_button = ""; 
		view_albums_button += "<button id='back-to-album-button' data-rel='filter-" + album_author_id + "' class='button small radius back-to-album-grid-button' type='button'>";
		view_albums_button += "<i class='step fi-arrow-left'></i> Back ";
		view_albums_button += "</button> ";
		view_albums_button += " <button id='all-albums-button' class='button small radius' type='button' >";
		view_albums_button += "<i class='step fi-results'></i> All Albums";
		view_albums_button += "</button>";
		$("#albums-nav").html(view_albums_button);
	}, 101);

});



/*******************************
	INITIALIZE PHOTOS GRID HTML
*******************************/
function photos_Grid_HTML(id) {

	$("#albums").html("<div class='cell small-12'><p>Loading...</p></div>");

	$.getJSON("https://jsonplaceholder.typicode.com/albums/" + id + "/photos").done( function( photos_data ){

		photos_html = "";

		$.each( photos_data , function(key, photo) {

			photos_html += "<div class='img-tile'><div class='img-wrapper'>" ;
			photos_html += "<img class='view-full-photo' data-open='Modal_Reveal' data-album='" + photo.albumId + "' src='" + photo.thumbnailUrl + "' href='" + photo.url + "'>" ;
			// full
			photos_html += "<div id='view-full-photo' class='button-group' data-open='Modal_Reveal' data-album='" + photo.albumId + "' src='" + photo.thumbnailUrl + "' href='" + photo.url + "' type='button'>";
			/*photos_html += "<button id='view-full-photo' data-open='Modal_Reveal' class='button radius tiny round hollow' data-album='" + photo.albumId + "' data-id='" + photo.id + "' href='" + photo.url + "' type='button'>";
			photos_html += "<i class='step fi-magnifying-glass'></i>";
			photos_html += "</button> "; /**/
			// update
			photos_html += "<button id='update-photo-button' data-open='Modal_Reveal' class='button radius warning tiny round hollowzor' data-album='" + photo.albumId  + "' data-id='" + photo.id + "' type='button' >";
			photos_html += "<i class='step fi-pencil'></i>";
			photos_html += "</button> ";
			// delete
			photos_html += "<button id='delete-photo-button' data-open='Modal_Reveal' class='button radius alert tiny round hollowzor' data-album='" + photo.albumId  + "' data-id='" + photo.id + "' type='button'>";
			photos_html += "<i class='step fi-trash'></i>";
			photos_html += "</button> </div>";
			photos_html += "</div></div>";
			
		});

		$("#albums").html(photos_html);

	});

}



/*******************************
	RELOAD PHOTOS GRID
*******************************/
function reload_Photos(id) {

	const fadePhotos = function() {
		return $("#albums").fadeTo(100, 0);
	};

	const reloadPhotos = function() {
		setTimeout(function(){
			photos_Grid_HTML(id);
		}, 101);
	};

	$.when( fadePhotos(), reloadPhotos() ).done(function(){
		$("#albums").fadeTo(300, 1);
	});

};



/**********************
	CALL OUT BOX
**********************/
 function call_out_photo(action) {

 	photo_call_out = "";
	photo_call_out += "<div class='callout success' data-closable>";
	photo_call_out += "<p> Photo has been " + action + "</p>";
	photo_call_out += "<button class='close-button' aria-label='Dismiss alert' type='button' data-close>";
	photo_call_out += "<span aria-hidden='true'>&times;</span>";
	photo_call_out += "</button>";
	photo_call_out += "</div>";
	$("#album-callout").html(photo_call_out);

};



/*******************************
	FULL SIZE PHOTO MODAL
/*******************************/
$(document).on("click", "#view-full-photo", function(){

	const id = $(this).attr("data-album");

	view_full_photo = "";
	view_full_photo += "<img id='img01' data-album='" + id  + "' src='' />";
	view_full_photo += "<button data-close aria-label='Close modal' class='close-button' type='button'><span aria-hidden='true'>&times;</span></button>";
	$("#Modal_Reveal").html(view_full_photo);

	$("#img01").attr("src", this.getAttribute("href") );

});



/*******************************
	EDIT / UPDATE PHOTO
*******************************/
$(document).on("click", "#update-photo-button", function(event) {

	// prevents full img loading
	event.stopPropagation();

	$("#Modal_Reveal").html("<div class='cell small-12'><p>Loading...</p></div>");
    
	const id = $(this).attr("data-id");

	$.getJSON("https://jsonplaceholder.typicode.com/albums/").done( function(album_data){

		$.getJSON("https://jsonplaceholder.typicode.com/users/").done( function(user_data){

			$.getJSON("https://jsonplaceholder.typicode.com/photos/" + id ).done( function(photo){

				// AUTHOR - ALBUMS SELECT OPTIONS
				albums_options_html = "";
				albums_options_html += "<select name='albumId' class='form-control'>";
				$.each(album_data, function(key, album) {
					$.each(user_data, function(key, user){
						if ( user.id === album.userId ) {
							if ( album.id === photo.albumId ) {
								albums_options_html += "<option value='" + album.id + "' selected>" + user.name + " - " + album.title + "</option>";
							} else {
								albums_options_html += "<option value='" + album.id + "'>" + user.name + " - " + album.title + "</option>";
							}
						}				
					});
				});
				albums_options_html += "</select>";

				// UPDATE FORM HMTL
				update_photo_html = "";
				update_photo_html += "<form id='update-photo-form' action='#' class='cell' method='post' border='0'>";
				update_photo_html += "<div class='cell'> <h4> Update Photo </h4> <hr></div>";
				// name field
				update_photo_html += "<div class='cell'>";
				update_photo_html += "<label>Photo Name";
				update_photo_html += "<input value='" + photo.title + "' type='text' name='title' class='form-control' required /></td>";
				update_photo_html += "</label></div>";
				// categories 'select' field
				update_photo_html += "<div class='cell'>";
				update_photo_html += "<label>Author - Album";
				update_photo_html += albums_options_html;
				update_photo_html += "</label></div>";
				// hidden 'product id' to identify which record to delete
				update_photo_html += "<input value='" + id + "' name='id' type='hidden' />";
				// submit button
				update_photo_html += "<div class='medium-12'>";
				update_photo_html += "<button type='submit' class='button success radius view-photos-button' data-album='" + photo.albumId  + "' data-id='" + id + "'>";
				update_photo_html += " Update Photo</button> ";
				update_photo_html += " <button data-close aria-label='Close modal' class='button radius secondary' type='button'>";
	    		update_photo_html += " Cancel </button>";
				update_photo_html += "</div>";
				update_photo_html += "</form>";

				$("#Modal_Reveal").html(update_photo_html);

				/******************************
					ON SUBMIT - UPDATE PHOTO 
				/******************************/
				$(document).on("submit", "#update-photo-form", function(){

					var form_data=JSON.stringify($(this).serializeObject());
					
					$.ajax({
						url: "https://jsonplaceholder.typicode.com/photos/" + id ,
						method : "PATCH",
						contentType : "application/json",
						data : form_data
					})
					.done(function(){
				    	call_out_photo("updated");
				    })
				    .fail(function(jqXHR, textStatus, errorThrown){
				    	call_out_fail();
				    	console.log(textStatus + ": " + errorThrown);
				    })
				    .always(function(){
				    	$("#Modal_Reveal").foundation("close");
						reload_Photos(photo.albumId);
				    });
					return false;
				});

			});// get photos

		});// get users

	});// get albums

});



/*******************************
	DELETE PHOTO
*******************************/
$(document).on("click", "#delete-photo-button", function(event){

	// prevents full img loading
	event.stopPropagation();

	$("#Modal_Reveal").html("<div class='cell small-12'><p>Loading...</p></div>");

	const photo_id = $(this).attr("data-id");
	const album_id = $(this).attr("data-album");

	$.getJSON("https://jsonplaceholder.typicode.com/photos/" + photo_id ).done( function(photo){

		// CONFIRM DELETE MODAL
		delete_photo_modal = "";
		delete_photo_modal += "<div class='cell'> <h4> Delete Photo </h4> <hr>";
		delete_photo_modal += "<p>Are you sure you want to delete the photo <i>" + photo.title + "?</i></p></div>";
		delete_photo_modal += "<div class='button-group'>";
		delete_photo_modal += "<button data-close aria-label='Close modal' type='button' id='confirm-delete-photo' class='close-buttons button alert radius' data-album='" + album_id + "' data-id='" + photo_id + "'>" ;
		delete_photo_modal += " Confirm Delete</button> " ;
		delete_photo_modal += "<button data-close aria-label='Close modal' type='button' class='button secondary radius'>" ;
		delete_photo_modal += " Cancel </button>" ;
		delete_photo_modal += "</div>";
		
		$("#Modal_Reveal").html(delete_photo_modal);

	});

	$(document).on("click", "#confirm-delete-photo", function(){
	    $.ajax({
	        url: "https://jsonplaceholder.typicode.com/photos/" + photo_id,
			method : "DELETE",
	        dataType : "json",
	        data : JSON.stringify({ id: photo_id })
	    })
	    .done(function(){
	    	call_out_photo("deleted");
	    })
	    .fail(function(jqXHR, textStatus, errorThrown){
	    	call_out_fail();
	    	console.log(textStatus + ": " + errorThrown);
	    })
	    .always(function(){
	    	reload_Photos(album_id);
	    });
	    return false;
	});

});
