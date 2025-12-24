document.getElementById("darkToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

const API_URL = 'http://localhost:3000/todos';

const todoForm = document.getElementById('todoForm');
const todoList = document.getElementById('todoList');
const categoryFilter = document.getElementById('categoryFilter');


async function fetchTodos(selectedCategory = "") {
    let url = API_URL;
    
   
    if (selectedCategory) {
        url += `?category=${selectedCategory}`;
    }

    try {
        const response = await fetch(url);
        const tasks = await response.json();
        renderTodos(tasks);
    } catch (error) {
        console.error("Could not fetch tasks:", error);
    }
}




function renderTodos(tasks) {
    todoList.innerHTML = '';
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `todo-item ${task.completed ? 'completed' : ''}`;
        div.innerHTML = `
            <div>
                <strong>${task.title}</strong> <small>[${task.category}]</small>
                <p>${task.description}</p>
                <span style="font-size: 0.8rem">📅 ${task.dueDate}</span>
            </div>
            <div class="actions">
                <button onclick="editTask('${task.id}')">Edit</button>
                <button onclick="completeTask('${task.id}')">Complete</button>
                <button onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        `;
        todoList.appendChild(div);
    });
}



todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newTask = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        dueDate: document.getElementById('dueDate').value,
        completed: false
    };

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    });

    todoForm.reset();
    fetchTodos(categoryFilter.value); 
});

async function editTask(id) {
    try {
       
        const response = await fetch(`${API_URL}/${id}`);
        const task = await response.json();

        
        const newTitle = prompt("Edit title:", task.title);
        if (newTitle === null) return;

        const newDescription = prompt("Edit description:", task.description);
        if (newDescription === null) return;

        const newCategory = prompt("Edit category:", task.category);
        if (newCategory === null) return;

        const newDueDate = prompt("Edit due date (YYYY-MM-DD):", task.dueDate);
        if (newDueDate === null) return;

       
        await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription,
                category: newCategory,
                dueDate: newDueDate
            })
        });

        fetchTodos(categoryFilter.value);
    } catch (error) {
        console.error("Edit failed:", error);
    }
}

categoryFilter.addEventListener('change', (e) => {
    fetchTodos(e.target.value);
});

async function completeTask(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    fetchTodos(categoryFilter.value);
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTodos(categoryFilter.value);
}


fetchTodos();