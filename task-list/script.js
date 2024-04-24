class TaskListWidget extends HTMLElement {
    constructor() {
        super();
        this.tasks = [];
    }

    init() {
        this.innerHTML = `
            <div class="container">
                <h2>Todo List</h2>
                
                <div class="inputContainer">
                    <div>
                        <input type="text" id="taskInput" placeholder="Enter task...">
                    </div>
                    <div>
                        <input type="date" id="dateInput">
                        <input type="time" id="timeInput">
                    </div>
                </div>
                <button id="addBtn">Add Task</button>
                
                <div class="list-widget" id="taskList">
                    <!-- Tasks will be added dynamically here -->
                </div>
            </div>`;
    }

    connectedCallback() {
        if (localStorage.getItem("tasks") !== null) {
            this.tasks = JSON.parse(localStorage.getItem("tasks"));
            this.renderTasks();
            return;
        }

        const src = this.getAttribute('src');
        if (src) {
            fetch(src)
                .then(response => response.json())
                .then(data => {
                    this.tasks = data;
                    this.renderTasks();
                })
                .catch(error => {
                    console.error('Error fetching JSON:', error);
                });
        } else {
            console.error('No src attribute provided.');
        }
    }

    addTask(task, container, id) {
        const task_container = document.createElement('div'); // Create <li> for each task
        task_container.classList.add("task-item");
        task_container.style.marginBottom = '10px'; // Add margin for spacing between tasks

        // Create checkbox for task status
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.is_done || false; // Set checkbox state based on task completion status
        checkbox.id = `task${id}`;

        // Display task title
        const titleText = document.createElement('label');
        titleText.innerHTML = task.title;
        titleText.setAttribute("for", `task${id}`)
        titleText.style.marginLeft = '10px'; // Add margin for spacing between checkbox and title
        
        // Display due date
        const dueDateText = document.createElement('h4');
        const dueDate = new Date(task.due_date);
        dueDateText.innerHTML = 'Due Date: ' + dueDate.toLocaleString();

        // Append checkbox, title, and due date to <li> element
        task_container.appendChild(checkbox);
        task_container.appendChild(titleText);
        task_container.appendChild(dueDateText);

        container.appendChild(task_container); // Append <li> to <ul>
    }

    updateLocalStorage() {
        if (this.tasks.length > 0) {
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        }
    }

    addTaskToList(taskText, taskDate, taskTime, isChecked) {
        const task = {
            title: taskText,
            is_done: isChecked,
            due_date: `${taskDate} ${taskTime}`
        }

        this.tasks.push(task);
        this.renderTasks();
        this.updateLocalStorage();
    }

    renderTasks() {
        this.init();
        const ul = document.createElement('ul'); // Create <ul> element
        ul.id = "task_list_ul";
        ul.style.listStyleType = 'none'; // Remove default list-style (bullets)

        this.tasks.forEach((task, idx) => {
            this.addTask(task, ul, idx);
        });

        const addBtn = document.getElementById('addBtn');
        const taskInput = document.getElementById('taskInput');
        const dateInput = document.getElementById('dateInput');
        const timeInput = document.getElementById('timeInput');

        addBtn.addEventListener('click', () => {
            const taskText = taskInput.value.trim();
            const taskDate = dateInput.value;
            const taskTime = timeInput.value;
            if (taskText !== '') {
                this.addTaskToList(taskText, taskDate, taskTime, false);
                taskInput.value = '';
                // Preserve the current date and time if not modified
                if (dateInput.value === `${year}-${month}-${day}`) {
                    dateInput.value = '';
                }
                if (timeInput.value === `${hours}:${minutes}`) {
                    timeInput.value = '';
                }
            } else {
                alert('Please enter a task.');
            }
        });

        this.appendChild(ul); // Append <ul> to the custom element
    }

    removeTaskFromLocalStorage(taskText, taskDate, taskTime) {
        // Find index of the task to remove
        const index = tasks.findIndex(task => task.text === taskText && task.date === taskDate && task.time === taskTime);
        if (index !== -1) {
            tasks.splice(index, 1); // Remove task from array
            this.updateLocalStorage();
            this.renderTasks();
        }
    }
}

customElements.define('task-list-widget', TaskListWidget);