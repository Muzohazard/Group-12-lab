const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const prioritySelect = document.getElementById("priority-select");
const dueDateInput = document.getElementById("due-date");

const priorityOrder = { urgent: 1, normal: 2, casual: 3 };

// ADD TASK
function addTask() {

    if (inputBox.value === '') {
        alert("You must write something!");
    } else {

        let li = document.createElement('li');

        let taskText = inputBox.value;
        let dueDate = dueDateInput.value;

        li.innerHTML = taskText + (dueDate ? ` <small>(Due: ${dueDate})</small>` : "");
        li.setAttribute('data-priority', prioritySelect.value);
        li.setAttribute('data-due', dueDate);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";

        li.appendChild(span);
        listContainer.appendChild(li);

        checkReminder(taskText, dueDate);
    }

    inputBox.value = "";
    dueDateInput.value = "";
    saveData();
    updateProgress();
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
        updateProgress();
    }
}, false);

// SAVE DATA
function saveData() {
    let tasks = [];
    let lis = listContainer.querySelectorAll('li');

    lis.forEach(li => {
        let text = li.childNodes[0].textContent;
        let priority = li.getAttribute('data-priority');
        let due = li.getAttribute('data-due');
        let checked = li.classList.contains('checked');

        tasks.push({ text, priority, checked, due });
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

li.innerHTML = task.text + (task.due ? ` <small>(Due: ${task.due})</small>` : "");

li.setAttribute('data-priority', task.priority);
li.setAttribute('data-due', task.due);
checkReminder(task.text, task.due);

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

function checkReminder(task, dueDate){

    if(!dueDate) return;

    const dueTime = new Date(dueDate).getTime();
    const now = new Date().getTime();

    const delay = dueTime - now;

    if(delay > 0){

        setTimeout(() => {
            alert("Reminder: Task due -> " + task);
        }, delay);

    }
}

function updateProgress(){

    const tasks = listContainer.querySelectorAll("li");
    const completed = listContainer.querySelectorAll("li.checked");

    const total = tasks.length;
    const done = completed.length;

    if(total === 0) return;

    const percent = Math.round((done / total) * 100);

    document.getElementById("progress-bar").value = percent;
    document.getElementById("progress-text").innerText = percent + "%";
}

updateProgress();