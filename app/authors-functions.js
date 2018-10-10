$(document).ready( function() {

	authorList(); 
	button_add_author();

	/**************************
	HIGHLIGHT SELECTED AUTHOR
	**************************/
	$(document).on("click" , ".author-filter" , function(event){
		selectedClass = $(this).attr("data-rel");
		// highlights current selected album
		event.preventDefault();
		event.stopPropagation();
		$(this).closest("ul").find(".selected").removeClass("selected");
		$(this).addClass("selected");
		// if selecting album while viewing photo gallery - ( 'all' class is added to every album )
		if ( ! $("#albums > div").hasClass("all") ) {
			reload_AlbumGrid();
			button_add_album();
		} else {
			// display selected album / hide non-selected album
			$("#albums>div").not("."+selectedClass).fadeOut();
			$("#albums").fadeTo(100, 0);
			setTimeout(function() {
				$("."+selectedClass ).fadeIn();
				$("#albums").fadeTo(300, 1);
			}, 300);
		}
	});
});



/*******************************
	INITIAL AUTHORS LIST
*******************************/
function authorList(){

	$("#authors").html("<div class='cell'><p>Loading...</p></div>");

	$.getJSON("https://jsonplaceholder.typicode.com/users").done( function(users_data) {
		authors = "";
		authors += "<ul id='author-menu' class='filters'>" ;
		authors += "<li class='author-filter selected' data-rel='all'>All</li>" ;
		$.each(users_data, function(key, user){
			authors += "<li class='author-filter' data-rel='filter-" + user.id + "'>" + user.name + " ";
			authors += "<div class='author-buttons'><button id='update-author-button' data-open='Modal_Reveal' class='button round tiny hollow secondary' data-author-id='" + user.id  + "' data-author-name='" + user.name  + "' type='button' >";
			authors += "<i class='step fi-pencil'></i> ";
			authors += "</button> ";
			// delete
			authors += "<button id='delete-author-button' data-open='Modal_Reveal' class='button round tiny hollow secondary' data-author-id='" + user.id  + "' data-author-name='" + user.name  + "' type='button'>";
			authors += "<i class='step fi-trash'></i>";
			authors += "</button></div>";
			authors += "</li>";
		});
		authors += "</ul>";

		$("#authors").html(authors);
	});
};



/*******************************
	RELOAD AUTHORS LIST
*******************************/
function reload_AuthorList() {
	
	const fadeAuthors = function() {
		$("#authors").fadeTo(100, 0);
	};

	$.when( fadeAuthors(), authorList() ).done(function(){
		$("#authors").fadeTo(300, 1);
	});
};



/*******************************
	ADD AUTHOR BUTTON
*******************************/
function button_add_author() {
	add_new_author = "";
	add_new_author += "<button data-open='Modal_Reveal' id='add-author' class='button small radius' type='button'>";
	add_new_author += "<i class='step fi-plus'></i> Add Author</button>";
	$("#authors-nav").html(add_new_author);
}



/**********************
	CALL OUT BOX
**********************/
function call_out_box(action) {
	author_call_out = "";
	author_call_out += "<div class='callout success' data-closable>";
	author_call_out += "<p> Author has been " + action + "</p>";
	author_call_out += "<button class='close-button' aria-label='Dismiss alert' type='button' data-close>";
	author_call_out += "<span aria-hidden='true'>&times;</span>";
	author_call_out += "</button>";
	author_call_out +=  "</div>";
	$("#author-callout").html(author_call_out);
}

function call_out_fail_author() {
	callout_fail = "";
	callout_fail += "<div class='callout alert' data-closable>";
	callout_fail += "<p>There was an error</p>";
	callout_fail += "<button class='close-button' aria-label='Dismiss alert' type='button' data-close>";
	callout_fail += "<span aria-hidden='true'>&times;</span>";
	callout_fail += "</button>";
	callout_fail +=  "</div>";
	$("#author-callout").html(callout_fail);
}



/*******************************
	CREATE / ADD NEW AUTHOR
*******************************/
$(document).on("click", "#add-author", function(){
	create_author_form = "";
	create_author_form += "<form id='create-author-form' class='cell' action='#' method='post' border='0'>";
	create_author_form += "<div class='cell'> <h4> Create New Author </h4> <hr></div>";
	// name field
	create_author_form += "<div class='cell'>";
	create_author_form += "<label>Author's Name <input type='text' name='name' class='form-control' required /> </label>";
	create_author_form += "</div>";
	// button to submit form / cancel
	create_author_form += "<div class='cell'>";
	create_author_form += "<button type='submit' class='button radius success'>";
	create_author_form += " Create Author </button> ";
	create_author_form += " <button data-close aria-label='Close modal' class='button radius secondary' type='button' >";
	create_author_form += " Cancel </button>";
	create_author_form += "</div> </form>";

	$("#Modal_Reveal").html(create_author_form);
});
/******************************
	POST DATA / SUBMIT NEW AUTHOR FORM
******************************/
$(document).on("submit", "#create-author-form", function(){

	button_add_album();
	var form_data = JSON.stringify($(this).serializeObject());

	$.ajax({
		url: "https://jsonplaceholder.typicode.com/users",
		method : "POST",
		contentType : "application/json",
		data : form_data
	})
	.done(function(){
		call_out_box("created");
	})
	.fail(function(jqXHR, textStatus, errorThrown){
		call_out_fail_author();
		console.log(textStatus + ": " + errorThrown);
	})
	.always(function(){
		reload_AuthorList();
		$("#Modal_Reveal").foundation("close");
	});
	return false;
});



/*******************************
	EDIT / UPDATE AUTHOR'S NAME
*******************************/
$(document).on("click" , "#update-author-button", function(event){

	const id = $(this).attr("data-author-id");
	const name = $(this).attr("data-author-name");
	// allows click edit buttons without triggering highlight
	event.stopPropagation();

	edit_author_form = "";
	edit_author_form += "<form id='update-author-form' class='cell' action='#' method='post' border='0'>";
	edit_author_form += "<div class='cell'> <h4> Update Author </h4> <hr></div>";
	// name field
	edit_author_form += "<div class='medium-12 cell'>";
	edit_author_form += "<label>Author's Name <input value='" + name  + "' type='text' name='name' class='form-control' required /> </label>";
	edit_author_form += "</div>";
	edit_author_form += "<input value='" + id + "' name='id' type='hidden' />";
	// button to submit form / cancel
	edit_author_form += "<div class='medium-12 cell'>";
	edit_author_form += "<button type='submit' class='button radius success'>";
	edit_author_form += " Update Author </button> ";
	edit_author_form += " <button type='button' data-close aria-label='Close modal' class='button radius secondary'>";
	edit_author_form += " Cancel </button>";
	edit_author_form += "</div> </form>";

	$("#Modal_Reveal").html(edit_author_form);

	/******************************
	UPDATE AUTHOR SUBMIT
	/******************************/
	$(document).on("submit", "#update-author-form", function(){

		button_add_album();
		var form_data = JSON.stringify($(this).serializeObject());

		$.ajax({
			url: "https://jsonplaceholder.typicode.com/users/" + id ,
			method : "PATCH",
			contentType : "application/json",
			data : form_data
		})
		.done( function(){
			call_out_box("updated");
		})
		.fail( function(jqXHR, textStatus, errorThrown){
			call_out_fail_author();
			console.log(textStatus + ": " + errorThrown);
		})
		.always( function(){
			reload_AuthorList();
			$("#Modal_Reveal").foundation("close");
		});
		return false;
	});
 });



/*******************************
	DELETE AUTHOR
*******************************/
$(document).on("click", "#delete-author-button", function(event){

	const id = $(this).attr("data-author-id");
	$("#Modal_Reveal").html("<div class='cell'><p>Loading...</p></div>");
	// allows click delete buttons without triggering highlight
	event.stopPropagation();

	$.getJSON("https://jsonplaceholder.typicode.com/users/"+ id).done( function(users_data) {
		delete_author_modal = "";
		delete_author_modal += "<div class='cell'> <h4> Delete Author </h4> <hr>";
		delete_author_modal += "<p>Are you sure you want to delete the author <i>" + users_data.name + "</i>?</p> </div>";
		delete_author_modal += "<div class='button-group'>";
		delete_author_modal += "<button data-close aria-label='Close modal' type='button' id='confirm-delete-author' data-author-id='"+id+"' class='close-buttons button alert radius'>" ;
		delete_author_modal += " Confirm Delete</button> " ;
		delete_author_modal += "<button data-close aria-label='Close modal' type='button' class='close-buttons button secondary radius'>" ;
		delete_author_modal += " Cancel </button>" ;
		delete_author_modal += "</div>";

		$("#Modal_Reveal").html(delete_author_modal);
	});

	/******************************
	CONFIRM DELETE SUBMIT
	/******************************/
	$(document).on("click", "#confirm-delete-author", function(){
		$.ajax({
			url: "https://jsonplaceholder.typicode.com/users/" + id,
			method : "DELETE",
			dataType : "json",
			data : JSON.stringify({ id: id })
		})
		.done(function(){
			call_out_box("deleted");
		})
		.fail(function(jqXHR, textStatus, errorThrown){
			call_out_fail_author();
			console.log(textStatus + ": " + errorThrown);
		})
		.always(function(){
			reload_AuthorList();
		});
		return false;
	});
});
