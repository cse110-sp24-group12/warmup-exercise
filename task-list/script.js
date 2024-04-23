class TaskListWidget extends HTMLElement {
    constructor() {
        super();
        this.tasks = [];
    }

    init() {
        this.innerHTML = `
            <div class="container">
                <h2>Todo List</h2>
                
                <input type="text" id="taskInput" placeholder="Enter task...">
                <input type="date" id="dateInput">
                <input type="time" id="timeInput">
                <button id="addBtn">Add Task</button>
                
                <ul id="taskList">
                    <!-- Tasks will be added dynamically here -->
                </ul>
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

    addTask(task, ul) {
        const li = document.createElement('li'); // Create <li> for each task
        li.style.marginBottom = '10px'; // Add margin for spacing between tasks

        // Create checkbox for task status
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.is_done || false; // Set checkbox state based on task completion status
        checkbox.disabled = false; // Disable checkbox (optional)

        // Display task title
        const titleText = document.createElement('span');
        titleText.textContent = task.title;
        titleText.style.marginLeft = '10px'; // Add margin for spacing between checkbox and title
        
        // Display due date
        const dueDateText = document.createElement('span');
        const dueDate = new Date(task.due_date);
        dueDateText.textContent = ' - Due: ' + dueDate.toLocaleString();
        dueDateText.style.color = 'gray'; // Style due date text

        // Append checkbox, title, and due date to <li> element
        li.appendChild(checkbox);
        
        li.appendChild(titleText);
        
        li.appendChild(dueDateText);

        ul.appendChild(li); // Append <li> to <ul>
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

        this.tasks.forEach(task => {
            this.addTask(task, ul);
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