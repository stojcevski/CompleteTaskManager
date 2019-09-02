
/*==================================================================================*/
/* Set page header and Fill list details before page is presented
/*==================================================================================*/
(function() {
    var urlParams = new URLSearchParams(window.location.search);
    var selectedListNumber = urlParams.get('no');

    document.addEventListener("DOMContentLoaded", function(){

        //Fill input elements for categories and tags retrieving local storage
        fillCategoriesTags();

        switch (urlParams.get('type')) {
            case 'details':
                document.getElementById("header").innerHTML = "List Details";
                //Fill list details
                fillListDetails(selectedListNumber);
                break;
            case 'new':
                document.getElementById("header").innerHTML = "New List";
                break;
        }
    });
})();

/*==================================================================================*/
/* Fill input elements for categories and tags retrieving local storage
/*==================================================================================*/
function fillCategoriesTags() {

    //Check browser WebStorage support
    if (typeof(Storage) !== "undefined") {

        if(localStorage.getItem("categories") != null && localStorage.getItem("tags") != null) {

            // Retrieve local storage
            var categories = JSON.parse(localStorage.getItem("categories"));
            var tags = JSON.parse(localStorage.getItem("tags"));
        }

    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }

    var categoriesDropdown = document.getElementById("categoriesDropdown");
    var tagsDropdown = document.getElementById("tagsDropdown");

    categoriesDropdown.options.length = 0;
    tagsDropdown.options.length = 0;

    //Fill select elements
    if(categories != null || tags != null) {
        for (var i = 0; i < categories.length; i++) {
            var newItem = document.createElement("option");
            newItem.value = categories[i];
            newItem.innerHTML = categories[i];
            categoriesDropdown.appendChild(newItem);
        }

        for (var i = 0; i < tags.length; i++) {
            var newItem = document.createElement("option");
            newItem.value = tags[i];
            newItem.innerHTML = tags[i];
            tagsDropdown.appendChild(newItem);
        }
    }
    else {
        alert("You have to create at least one Category and one Tag!");
        document.location.href = "mainPage.html";
    }
}

/*==================================================================================*/
/* Fill list details
/*==================================================================================*/
function fillListDetails(listNumber) {
    //Check browser WebStorage support
    if (typeof(Storage) !== "undefined") {

        if(localStorage.getItem("lists") != null) {

            // Retrieve local storage
            var lists = JSON.parse(localStorage.getItem("lists"));
            var selectedList = lists[listNumber];
            var listName = selectedList[0];
            var listCategory = selectedList[1];
            var listTags = selectedList[2];
            var listTasks = selectedList[3];

            document.getElementById("listNameInput").value = listName;
            document.getElementById("categoriesDropdown").value = listCategory;

            var numOfTags = document.getElementById("tagsDropdown").options.length;

            //Fill multi select element with retrieved tags
            if(listTags != null) {
                for (var i = 0; i < listTags.length; i++) {
                    for (var j = 0; j < numOfTags; j++) {
                        if (document.getElementById("tagsDropdown")[j].value == listTags [i]) {
                            document.getElementById("tagsDropdown")[j].selected = true;
                        }
                    }
                }
            }

            //Append task row in tasks column defining row color depending on task state
            if(listTasks != null) {
                 for (var i = 0; i < listTasks.length; i++) {
                     var task = listTasks[i];
                     if(task[2] == "Completed") {
                         appendTaskRow(task[0], task[1], task[2], "green", i);
                     } else {
                         appendTaskRow(task[0], task[1], task[2], "red", i);
                     }

                 }
            }
        }

    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}

/*==================================================================================*/
/* Show "Add task wrapper" on btn clicked
/*==================================================================================*/
function showAddTaskWrapper(type, element) {
    var taskWrapper = document.getElementById("taskWrapper");
    var listNumber = new URLSearchParams(window.location.search).get('no');

    switch (type) {
        case 'details':
            var elementNo = element.parentNode.getAttribute("data");
            fillAddTaskWrapper(listNumber, elementNo);
            document.getElementById("submitTaskBtn").setAttribute('data', 'details');
            taskWrapper.setAttribute("data-taskNumber", elementNo);
            break;
        case 'new':
            document.getElementById("submitTaskBtn").setAttribute('data', 'new');
            break;
    }

    taskWrapper.style.display = "block";
}

/*==================================================================================*/
/* Fill "Add Task Wrapper" with selected task details
/*==================================================================================*/
function fillAddTaskWrapper(listNumber, elNumber) {

    //Check browser WebStorage support
    if (typeof(Storage) !== "undefined") {

        // Retrieve local storage
        var lists = JSON.parse(localStorage.getItem("lists"));
        var list = lists[listNumber];
        var tasks = list[3];
        var selectedTask = tasks[elNumber];

        //Fill input fields
        document.getElementById("taskNameInput").value = selectedTask[0];
        document.getElementById("taskDescInput").value = selectedTask[1];
        document.getElementById("taskStateInput").value = selectedTask[2];
    }
    else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }

}

/*==================================================================================*/
/* Submit task btn clicked
/*==================================================================================*/
function submitTask() {

    var taskName = document.getElementById("taskNameInput").value;
    var taskDesc = document.getElementById("taskDescInput").value;
    var taskState = document.getElementById("taskStateInput").value;
    var btnTypeClicked = document.getElementById("submitTaskBtn").getAttribute('data');
    var taskClicked = document.getElementById("taskWrapper").getAttribute('data-tasknumber');
    var numberOfTasksInTable = document.getElementsByClassName("taskRow").length;

    if(taskName == "" || taskDesc == "" || taskState == "") {
        alert("All fields must be filled!");
    }
    else {

        switch (btnTypeClicked) {
            case 'details':
                updateTasksTable(taskClicked, taskName, taskDesc, taskState);

                break;
            case 'new':
                putTasksWebStorage(taskName, taskDesc, taskState);
                appendTaskRow(taskName, taskDesc, taskState, "grey", numberOfTasksInTable);
                break;
        }
        cancelTask();
    }
}

/*==================================================================================*/
/* Update changes in tasks table
/*==================================================================================*/
function updateTasksTable(taskClicked, newTaskName, newTaskDesc, newTaskState) {

    var taskRow = document.getElementsByClassName("taskRow")[taskClicked];

    taskRow.getElementsByClassName("taskNameRow")[0].textContent = newTaskName;
    taskRow.getElementsByClassName("taskStateRow")[0].textContent = newTaskState;
    taskRow.setAttribute("data-taskDesc", newTaskDesc);

    if (newTaskState == "Completed") {
        taskRow.getElementsByClassName("painted")[0].setAttribute("style", "background-color: green");
        taskRow.getElementsByClassName("painted")[1].setAttribute("style", "background-color: green");
    } else {
        taskRow.getElementsByClassName("painted")[0].setAttribute("style", "background-color: red");
        taskRow.getElementsByClassName("painted")[1].setAttribute("style", "background-color: red");
    }

}

/*==================================================================================*/
/* Insert task into local storage
/*==================================================================================*/
function putTasksWebStorage(taskName, taskDesc, taskState) {

    var tasks = [];
    var taskInput = [taskName, taskDesc, taskState];

    if (typeof(Storage) !== "undefined") {

        var localStorageTasks = localStorage.getItem("newTasks");

        //Store LocalStorage
        if(localStorageTasks == null || localStorageTasks == "null") {
            tasks.push(taskInput);
            localStorage.setItem("newTasks", JSON.stringify(tasks));
        } else {
            tasks = JSON.parse(localStorageTasks);
            tasks.push(taskInput);
            localStorage.setItem("newTasks", JSON.stringify(tasks));
        }
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}

function appendTaskRow(taskName, taskDesc, taskState, color, taskNo) {
    //Get html of temp row
    var html = document.getElementsByClassName("templateRow")[0];
    //Get the el of the table before which rows will be appended
    var table = document.getElementById("addList");
    var newTaskRow = html.cloneNode(true);
    newTaskRow.removeAttribute("hidden");

    //Set task number as data attribute
    newTaskRow.setAttribute("data", taskNo);

    newTaskRow.setAttribute("data-taskDesc", taskDesc);

    //Insert Task name and State in the row
    newTaskRow.getElementsByClassName("taskNameRow")[0].textContent = taskName;
    newTaskRow.getElementsByClassName("taskStateRow")[0].textContent = taskState;

    //Set Task color
    newTaskRow.getElementsByClassName("painted")[0].setAttribute("style", "background-color: "+color);
    newTaskRow.getElementsByClassName("painted")[1].setAttribute("style", "background-color: "+color);
    newTaskRow.classList.add("taskRow");

    //Append new Category row
    table.insertAdjacentHTML("beforebegin", newTaskRow.outerHTML);


    //ReSet Task color of template row
    html.getElementsByClassName("painted")[0].removeAttribute("style");
    html.getElementsByClassName("painted")[1].removeAttribute("style");
}

function cancelTask() {
    document.getElementById("taskNameInput").value = "";
    document.getElementById("taskDescInput").value = "";
    document.getElementById("taskStateInput").value = "";
    document.getElementById("submitTaskBtn").removeAttribute('data');
    document.getElementById("taskWrapper").removeAttribute('data-taskNumber');
    document.getElementById("taskWrapper").style.display = "none";
}

function submitList() {

    var listName = document.getElementById("listNameInput").value;
    var listCategory = document.getElementById("categoriesDropdown").value;
    var listTagsSelect = document.getElementById("tagsDropdown");
    var listTags = [];

    if (listTagsSelect.value != undefined) {
            for (var i = 0; i < listTagsSelect.options.length; i++) {
                if(listTagsSelect.options[i].selected) {
                    listTags.push(listTagsSelect.options[i].value);
                }
            }
    }

    if(listName != "") {
        //Update local storage data for list
        updateWebStorageLists(listName, listCategory, listTags);

        fillCategoriesTags();

        //Reset input values and go back to Lists Page
        document.getElementById("listNameInput").value = "";
        document.getElementById("backToListsBtn").click();
        
    }
    else {
        alert("You have to insert List Name!");
    }
}

/*==================================================================================*/
/* Update local storage with new or edited list
/*==================================================================================*/
function updateWebStorageLists(listName, listCategory, listTags) {
    var list = [];
    var urlParams = new URLSearchParams(window.location.search);


    if (typeof(Storage) !== "undefined") {

        var localStorageNewTasks = localStorage.getItem("newTasks");
        var localStorageLists = localStorage.getItem("lists");
        var newTasks = JSON.parse(localStorageNewTasks);
        var listId = urlParams.get('no');

        switch (urlParams.get('type')) {
            //What happens when List is updated
            case 'details':
                list = JSON.parse(localStorageLists);

                list[listId][0] = listName;
                list[listId][1] = listCategory;
                list[listId][2] = listTags;
                list[listId][3] = updateTasksList();

                localStorage.setItem("lists", JSON.stringify(list));
                break;
            //What happens when new List is stored
            case 'new':
                var listInput = [listName, listCategory, listTags, newTasks];
                //Store LocalStorage
                if(localStorageLists == null) {
                    list.push(listInput);
                    localStorage.setItem("lists", JSON.stringify(list));
                } else {
                    list = JSON.parse(localStorageLists);
                    list.push(listInput);
                    localStorage.setItem("lists", JSON.stringify(list));
                }
                break;
        }

        //Clear
        localStorage.removeItem("newTasks");

    }
    else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}

/*==================================================================================*/
/* Get tasks data from table and return it into list
/*==================================================================================*/
function updateTasksList() {
    var tasksList = [];
    var numberOfTaskRows = document.getElementsByClassName("taskRow").length;

        if(numberOfTaskRows > 0) {
            for (var i = 0; i < numberOfTaskRows; i++) {
                var taskRow = document.getElementsByClassName("taskRow")[i];
                var task = [];

                task[0] = taskRow.getElementsByClassName("taskNameRow")[0].textContent;
                task[1] = taskRow.getAttribute("data-taskdesc");
                task[2] = taskRow.getElementsByClassName("taskStateRow")[0].textContent;

                tasksList.push(task);
            }

            return tasksList;
        }
        else {
            return null;
        }




}

/*==================================================================================*/
/* Remove task row from table
/*==================================================================================*/
function removeTask(element) {

    var response = confirm("This will remove selected task and it cannot be undone!\n Are you sure?");

    if(response) {
        element.parentNode.remove();

        var numberOfTaskRows = document.getElementsByClassName("taskRow").length;
        //Reset task row numbers
        if(numberOfTaskRows > 0) {
            for (var i = 0; i < numberOfTaskRows; i++) {
                var taskRow = document.getElementsByClassName("taskRow")[i];
                taskRow.setAttribute("data", i);
            }
        }
    }
}