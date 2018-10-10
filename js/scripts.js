$(document).foundation()

$(document).ready(function(){

    // Crate HTML to inject into 'app'
    app_html = "";
    app_html += "<div id='Page-heading' class='page-header'><div class='grid-container'>";
    app_html += "<h1 id='page-title'>CRUD Operations</h1>";
    app_html += "</div></div>";
    // content
    app_html += "<div id='content-wrapper' class='grid-container'>";
    app_html += "<div id='page-content' class='grid-x grid-padding-x'>";
    // authors list
    app_html += "<div class='cell large-3 medium-3'>";
    app_html += "<header><h3>Authors</h3></header>";
    app_html += "<div id='authors-nav'></div>";
    app_html += "<div id='author-callout'></div>";
    app_html += "<div id='authors'></div>";
    app_html += "</div>";
    // albums grid
    app_html += "<div class='cell large-9 medium-9'>";
    app_html += "<header><h3>Albums</h3></header>";
    app_html += "<div id='albums-nav'></div>";
    app_html += "<div id='album-callout'></div>";
    app_html += "<div id='albums' class='grid-x grid-margin-x grid-padding-y'></div>";
    app_html += "</div>";
    app_html += "</div>"; // #PAGE CONTENT
    app_html += "</div>"; // #CONTENT WRAPPER
    // modal - reveal
    app_html += "<div class='reveal' id='Modal_Reveal'></div>" ;
    //inject 'app' into index.html
    $("#app").html(app_html);

    // modal - c.r.u.d. forms for albums, authors and photos
    new Foundation.Reveal($("#Modal_Reveal"));
    $("#Modal_Reveal").on("closed.zf.reveal", function(){
        $("#Modal_Reveal").empty();
    });
});


// FUNCTION TO MAKE FORM VALUES TO JSON FORMAT
$.fn.serializeObject = function(){
var o = {};
var a = this.serializeArray();
$.each(a, function() {
    if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
    } else {
        o[this.name] = this.value || '';
    }
});
return o;
};
