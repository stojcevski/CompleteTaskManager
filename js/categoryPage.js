/*==================================================================================*/
/* Fill categories table before Categories page is presented
/*==================================================================================*/
;(function() {
    //After document is ready
    document.addEventListener("DOMContentLoaded", function(){

        //Check browser WebStorage support
        if (typeof(Storage) !== "undefined") {

            if(localStorage.getItem("categories") != null) {

                // Retrieve local storage
                var categories = JSON.parse(localStorage.getItem("categories"));


                //Append retrieved categories in table rows
                for (var i = 0; i < categories.length; i++) {

                    appendCategoryRow(categories[i]);
                }
            }

        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
        }
    });
})();

/*==================================================================================*/
//Appends row in Categories Table
/*==================================================================================*/
function appendCategoryRow(category) {

    //Get html of temp row
    var html = document.getElementsByClassName("templateRow")[0];
    //Get the el of the table before which rows will be appended
    var table = document.getElementById("addList");

    //Insert Category name in the row
    html.getElementsByClassName("catNameRow")[0].textContent = category;
    //Append new Category row
    table.insertAdjacentHTML("beforebegin", html.innerHTML);
}

/*==================================================================================*/
/* Show "Add new category" wrapper on button click
/*==================================================================================*/
function showCategoryWrapper() {

    document.getElementById("categoryWrapper").style.display = "flex";

}

/*==================================================================================*/
/* Submits new category: updating web storage and categories table
/*==================================================================================*/
function submitCategory() {

    var categoryInput = document.getElementById("categoryInputField").value;
    var categories = [];

    if(categoryInput != '') {

        var localStorageCategories = localStorage.getItem("categories");

        if (typeof(Storage) !== "undefined") {
            //Store LocalStorage
            if(localStorageCategories == null) {
                categories.push(categoryInput);
                localStorage.setItem("categories", JSON.stringify(categories));
            } else {
                categories = JSON.parse(localStorageCategories);
                categories.push(categoryInput);
                localStorage.setItem("categories", JSON.stringify(categories));
            }
        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
        }

        //Update categories table
        appendCategoryRow(categoryInput);

        //Clear input form and hide
        cancelCategory();
    } else {
        alert("Category name cannot be empty!");
    }
}

/*==================================================================================*/
/* Clear input form and hide "Add new category" wrapper
/*==================================================================================*/
function cancelCategory() {
    document.getElementById("categoryInputField").value = "";
    document.getElementById("categoryWrapper").style.display = "none";
}