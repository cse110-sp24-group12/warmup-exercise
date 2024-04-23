document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('addBtn');
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');
    const taskList = document.getElementById('taskList');

    // Autofill date and time with current date and time
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = currentDate.getDate();
    day = day < 10 ? '0' + day : day;
    dateInput.value = `${year}-${month}-${day}`;

    let hours = currentDate.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = currentDate.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    timeInput.value = `${hours}:${minutes}`;

    // Load tasks from local storage
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    console.log("Saved tasks:", savedTasks); // Log the tasks
    // Clear the task list before populating it
    taskList.innerHTML = '';
    savedTasks.forEach(task => {
        addTaskToList(task.text, task.date, task.time, task.checked);
    });

    addBtn.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        const taskDate = dateInput.value;
        const taskTime = timeInput.value;
        if (taskText !== '') {
            addTaskToList(taskText, taskDate, taskTime, false);
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

    function addTaskToList(taskText, taskDate, taskTime, isChecked) {
        console.log("Adding task:", taskText, taskDate, taskTime); // Log the values
        const taskItem = document.createElement('li');
        taskItem.className = 'taskItem';
    
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isChecked;
        checkbox.addEventListener('change', function() {
            const taskContent = this.nextSibling;
            if (this.checked) {
                taskContent.style.textDecoration = 'line-through';
                taskContent.style.color = 'gray';
            } else {
                taskContent.style.textDecoration = 'none';
                taskContent.style.color = '';
            }
            updateLocalStorage();
        });
    
        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = taskText;
    
        const taskDateSpan = document.createElement('span');
        taskDateSpan.textContent = taskDate;
    
        const taskTimeSpan = document.createElement('span');
        taskTimeSpan.textContent = taskTime;
    
        const trashIcon = document.createElement('img');
        trashIcon.src = 'trash.png'; // Assuming the trash icon is in the same directory as your HTML and JS files
        trashIcon.alt = 'Delete';
        trashIcon.className = 'trashIcon';
        trashIcon.style.width = '15px'; // Adjust the width as needed
        trashIcon.style.height = 'auto'; // Maintain aspect ratio
        // trashIcon.addEventListener('mouseenter', function() {
        //     this.parentElement.classList.add('hovered');
        // });
        
        // trashIcon.addEventListener('mouseleave', function() {
        //     this.parentElement.classList.remove('hovered');
        // });
        
        trashIcon.addEventListener('click', function() {
            taskList.removeChild(taskItem);
            // Remove task from local storage
            removeTaskFromLocalStorage(taskText, taskDate, taskTime);
            updateLocalStorage();
        });
    
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskTextSpan);
        taskItem.appendChild(document.createTextNode(' - ')); // Add separator
        taskItem.appendChild(taskDateSpan);
        taskItem.appendChild(document.createTextNode(' ')); // Add space
        taskItem.appendChild(taskTimeSpan);
        taskItem.appendChild(document.createTextNode(' ')); // Add space
        taskItem.appendChild(trashIcon);
        taskList.appendChild(taskItem);
    
        updateLocalStorage();
    }
    

    function updateLocalStorage() {
        const tasks = [];
        document.querySelectorAll('.taskItem').forEach(taskItem => {
            const checkbox = taskItem.querySelector('input[type="checkbox"]');
            tasks.push({
                text: taskItem.querySelector('span').textContent,
                date: taskItem.querySelector('span:nth-child(3)').textContent,
                time: taskItem.querySelector('span:nth-child(5)').textContent,
                checked: checkbox.checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTaskFromLocalStorage(taskText, taskDate, taskTime) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        // Find index of the task to remove
        const index = tasks.findIndex(task => task.text === taskText && task.date === taskDate && task.time === taskTime);
        if (index !== -1) {
            tasks.splice(index, 1); // Remove task from array
            localStorage.setItem('tasks', JSON.stringify(tasks)); // Update local storage
        }
    }
});
