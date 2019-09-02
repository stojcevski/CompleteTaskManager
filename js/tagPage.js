/*==================================================================================*/
/* Fill tags table before Tags page is presented
/*==================================================================================*/
;(function() {
    //After document is ready
    document.addEventListener("DOMContentLoaded", function(){

        //Check browser WebStorage support
        if (typeof(Storage) !== "undefined") {

            console.log(localStorage.getItem("tags"));
            if(localStorage.getItem("tags") != null) {

                // Retrieve local storage
                var tags = JSON.parse(localStorage.getItem("tags"));


                //Append retrieved tags into table rows
                for (var i = 0; i < tags.length; i++) {

                    appendTagRow(tags[i]);
                }
            }

        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
        }
    });
})();

/*==================================================================================*/
//Appends row in Tags Table
/*==================================================================================*/
function appendTagRow(tag) {

    //Get html of temp row
    var html = document.getElementsByClassName("templateRow")[0];
    //Get the el of the table before which rows will be appended
    var table = document.getElementById("addList");

    //Insert Tag name in the row
    html.getElementsByClassName("tagNameRow")[0].textContent = tag;
    //Append new Tag row
    table.insertAdjacentHTML("beforebegin", html.innerHTML);
}

/*==================================================================================*/
/* Show "Add new tag" wrapper on btn click
/*==================================================================================*/
function showTagWrapper() {

    document.getElementById("tagWrapper").style.display = "flex";

}

/*==================================================================================*/
/* Submits new tag: updating web storage and tags table
/*==================================================================================*/
function submitTag() {

    var tagInput = document.getElementById("tagInputField").value;
    var localStorageTags = localStorage.getItem("tags");
    var tags = [];

    if(tagInput != '') {
        if (typeof(Storage) !== "undefined") {
            //Store LocalStorage
            if(localStorageTags == null) {
                tags.push(tagInput);
                localStorage.setItem("tags", JSON.stringify(tags));
            } else {
                tags = JSON.parse(localStorageTags);
                tags.push(tagInput);
                localStorage.setItem("tags", JSON.stringify(tags));
            }
        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
        }

        //Update tags table
        appendTagRow(tagInput);

        //Clear input form and hide
        cancelTag();
    } else {
        alert("Tag name cannot be empty!");
    }
}

/*==================================================================================*/
/* Clear input form and hide "Add new tag" wrapper
/*==================================================================================*/
function cancelTag() {
    document.getElementById("tagInputField").value = "";
    document.getElementById("tagWrapper").style.display = "none";
}