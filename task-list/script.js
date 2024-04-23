// // // window.onload = () => {
// // //     document.getElementById("h1").innerHTML = "Goodbye";
// // // }

// class TaskListWidget extends HTMLElement {
//     constructor() {
//         super();
//     }

//     connectedCallback() {
//         const src = this.getAttribute('src');
//         if (src) {
//             fetch(src)
//                 .then(response => response.json())
//                 .then(data => {
//                     this.renderTasks(data);
//                 })
//                 .catch(error => {
//                     console.error('Error fetching JSON:', error);
//                 });
//         } else {
//             console.error('No src attribute provided.');
//         }
//     }

//     renderTasks(tasks) {
//         this.innerHTML = ''; // Clear existing content

//         const ul = document.createElement('ul'); // Create <ul> element
//         ul.classList.add('list-widget'); // Apply list-widget class for styling

//         tasks.forEach(task => {
//             const li = document.createElement('li'); // Create <li> for each task
//             li.classList.add('task-item'); // Apply task-item class for styling

//             // Create checkbox for task status
//             const checkbox = document.createElement('input');
//             checkbox.type = 'checkbox';
//             checkbox.checked = task.is_done || false; // Set checkbox state based on task completion status
//             checkbox.addEventListener('change', () => {
//                 // Update task completion status when checkbox is changed
//                 task.is_done = checkbox.checked;
//                 // Apply CSS class based on completion status
//                 li.classList.toggle('completed', task.is_done);
//                 // Optionally, you can perform additional actions here (e.g., save updated tasks to server)
//                 console.log('Task status updated:', task);
//             });

//             // Display task title
//             const titleText = document.createElement('span');
//             titleText.textContent = task.title;
//             titleText.style.marginLeft = '10px'; // Add margin for spacing between checkbox and title
            
//             // Display due date
//             const dueDateText = document.createElement('span');
//             const dueDate = new Date(task.due_date);
//             dueDateText.textContent = " "+ dueDate.toLocaleString();
//             dueDateText.style.color = 'black'; // Set text color for due date

//             // Append checkbox, title, and due date to <li> element
//             li.appendChild(checkbox);
//             li.appendChild(titleText);
//             li.appendChild(dueDateText);

//             ul.appendChild(li); // Append <li> to <ul>
//         });

//         this.appendChild(ul); // Append <ul> to the custom element
//     }
// }

// customElements.define('task-list-widget', TaskListWidget);
class TaskListWidget extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const src = this.getAttribute('src');
        if (src) {
            fetch(src)
                .then(response => response.json())
                .then(data => {
                    this.renderTasks(data);
                })
                .catch(error => {
                    console.error('Error fetching JSON:', error);
                });
        } else {
            console.error('No src attribute provided.');
        }
    }

    renderTasks(tasks) {
        this.innerHTML = ''; // Clear existing content

        const ul = document.createElement('ul'); // Create <ul> element
        ul.classList.add('list-widget'); // Apply list-widget class for styling

        tasks.forEach(task => {
            const li = document.createElement('li'); // Create <li> for each task
            li.classList.add('task-item'); // Apply task-item class for styling

            // Create checkbox for task status
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.is_done || false; // Set checkbox state based on task completion status
            checkbox.addEventListener('change', () => {
                // Update task completion status when checkbox is changed
                task.is_done = checkbox.checked;
                // Update task text style based on completion status
                const taskText = li.querySelector('.task-title'); // Get task title span
                if (taskText) {
                    taskText.style.textDecoration = task.is_done ? 'line-through' : 'none';
                    taskText.style.color = task.is_done ? 'rgba(128, 128, 128, 0.5)' : 'inherit';
                }
                // Optionally, you can perform additional actions here (e.g., save updated tasks to server)
                console.log('Task status updated:', task);
            });

            // Display task title
            const titleText = document.createElement('span');
            titleText.textContent = task.title;
            titleText.classList.add('task-title'); // Apply class for task title styling
            titleText.style.marginLeft = '10px'; // Add margin for spacing between checkbox and title
            
            // Display due date
            const dueDateText = document.createElement('span');
            const dueDate = new Date(task.due_date);
            dueDateText.textContent = ' ' + dueDate.toLocaleString();
            dueDateText.style.color = 'black'; // Set text color for due date

            // Append checkbox, title, and due date to <li> element
            li.appendChild(checkbox);
            li.appendChild(titleText);
            li.appendChild(dueDateText);
            
            ul.appendChild(li); // Append <li> to <ul>
            
        });

        this.appendChild(ul); // Append <ul> to the custom element
    }
}

customElements.define('task-list-widget', TaskListWidget);
