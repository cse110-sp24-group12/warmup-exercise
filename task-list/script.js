// window.onload = () => {
//     document.getElementById("h1").innerHTML = "Goodbye";
// }

// Define the custom element
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
        ul.style.listStyleType = 'none'; // Remove default list-style (bullets)

        tasks.forEach(task => {
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
        });

        this.appendChild(ul); // Append <ul> to the custom element
    }
}

customElements.define('task-list-widget', TaskListWidget);
