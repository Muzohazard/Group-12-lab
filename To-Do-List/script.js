const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const prioritySelect = document.getElementById("priority-select");

const priorityOrder = { urgent: 1, normal: 2, casual: 3 };

// ADD TASK
function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        let li = document.createElement('li');
        li.innerHTML = inputBox.value;
        li.setAttribute('data-priority', prioritySelect.value);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7"; // delete symbol
        li.appendChild(span);

        listContainer.appendChild(li);
    }
    inputBox.value = "";
    saveData();
}

// CLICK EVENTS (CHECK OR DELETE)
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    }
    else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

// SAVE DATA
function saveData() {
    let tasks = [];
    let lis = listContainer.querySelectorAll('li');

    lis.forEach(li => {
        let text = li.childNodes[0].textContent;
        let priority = li.getAttribute('data-priority');
        let checked = li.classList.contains('checked');

        tasks.push({ text, priority, checked });
    });

    localStorage.setItem("data", JSON.stringify(tasks));
}

// DISPLAY TASKS
function showTask() {
    let tasks = JSON.parse(localStorage.getItem("data")) || [];

    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    listContainer.innerHTML = '';

    tasks.forEach(task => {

        let li = document.createElement('li');
        li.innerHTML = task.text;
        li.setAttribute('data-priority', task.priority);

        if (task.checked) {
            li.classList.add('checked');
        }

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";

        li.appendChild(span);
        listContainer.appendChild(li);

    });
}

showTask();


function searchTask() {

    let searchInput = document.getElementById("search-box").value.toLowerCase();

    let tasks = listContainer.getElementsByTagName("li");

    for (let i = 0; i < tasks.length; i++) {

        let taskText = tasks[i].childNodes[0].textContent.toLowerCase();

        if (taskText.includes(searchInput)) {
            tasks[i].style.display = "";
        } else {
            tasks[i].style.display = "none";
        }
    }
}
