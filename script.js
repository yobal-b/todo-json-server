const API_URL = 'http://localhost:3000/todos';

const todoForm = document.getElementById('todoForm');
const todoList = document.getElementById('todoList');
const categoryFilter = document.getElementById('categoryFilter');

document.getElementById("darkToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});


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


categoryFilter.addEventListener('change', (e) => {
    fetchTodos(e.target.value);
});


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
                <button onclick="deleteTask('${task.id}')">🗑️</button>
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


async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTodos(categoryFilter.value);
}


fetchTodos();