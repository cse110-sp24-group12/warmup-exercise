// Define the custom element
class TaskListWidget extends HTMLElement {
    constructor() {
        super();
    }
    // handle the error
    connectedCallback() {
        const src = this.getAttribute('src');
        this.innerHTML = '<p>Loading tasks...</p>';
        if (src) {
            fetch(src)
                .then(response => response.json())
                .then(data => {
                    this.renderTasks(data);
                })
                .catch(error => {
                    this.innerHTML = '<p>Error loading tasks.</p>';
                    console.error('Error fetching JSON:', error);
                });
        } else {
            console.error('No src attribute provided.');
        }
    }
    // start to deal with the json file
    renderTasks(tasks) {
        this.innerHTML = ''; // Clear existing content

        // have a container for all of our items in the json file
        const container = document.createElement('div');
        container.className = 'list-widget';
        container.id = 'task-list-widget-json';

        tasks.forEach((task, idx) => {
            const taskDiv = document.createElement('div'); // use <div> in html
            taskDiv.className = 'task-item'; // same class name with html in order to style it with css file

            // Create checkbox for task status
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.is_done; // Set checkbox state based on task completion status
            checkbox.id = 'task_json_' + idx; // create new id with the one for json file

            const label = document.createElement('label');
            label.htmlFor = checkbox.id; // Connect label with checkbox
            label.textContent = task.title;

            const dueDateText = document.createElement('h4');
            const dueDate = new Date(task.due_date);
            dueDateText.textContent = (dueDate.toISOString()).slice(0, -1); // except the Z at the end

            // handle whenever it need line in the beginning
            checkbox.addEventListener('change', () => {
                label.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
                label.style.color = checkbox.checked ? 'rgba(128, 128, 128, 0.5)' : 'inherit';
                console.log('Task status updated:', task);
            });

            // add the stuff we done to taskDiv
            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(label);
            taskDiv.appendChild(dueDateText);
            // add taskDiv to container
            container.appendChild(taskDiv);
        });

        this.appendChild(container); // Append container to the custom element
    }
}

customElements.define('task-list-widget', TaskListWidget);