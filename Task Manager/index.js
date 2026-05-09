let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
let currentEditingId = null;

// Elementos del DOM
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list-container');
const taskCounter = document.getElementById('task-counter');
const editModal = document.getElementById('edit-modal');

// Inicialización
document.addEventListener('DOMContentLoaded', renderTasks);

// 1. Funcion "Agregar tareas"
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    
    if (validateForm(title, description)) {
        const newTask = {
            id: Date.now(),
            title,
            description
        };
        
        tasks.push(newTask);
        saveAndRender();
        taskForm.reset();
    }
});

// 2. Validaciones
function validateForm(title, description) {
    let isValid = true;
    
    // Título vacío y mínimo de caracteres
    if (title.length < 3) {
        showError('title-error', 'Mínimo 3 caracteres');
        isValid = false;
    } else {
        showError('title-error', '');
    }

    // Tarea duplicada
    const exists = tasks.some(t => t.title.toLowerCase() === title.toLowerCase());
    if (exists) {
        showError('title-error', 'Esta tarea ya existe');
        isValid = false;
    }

    // Límite de descripción
    if (description.length > 100) {
        showError('desc-error', 'Máximo 100 caracteres');
        isValid = false;
    } else {
        showError('desc-error', '');
    }

    return isValid;
}

function showError(id, msg) {
    document.getElementById(id).textContent = msg;
}

// 3. Renderizado de tareas
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <div class="task-content">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
            </div>
            <div class="task-actions">
                <button class="btn-edit" onclick="openEditModal(${task.id})">Editar</button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;
        taskList.appendChild(li);
    });
    taskCounter.textContent = `Tareas pendientes: ${tasks.length}`;
}

// 4. Funcion "Eliminar"
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

// 5. Funcion "Editar"
function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    currentEditingId = id;
    document.getElementById('edit-title').value = task.title;
    document.getElementById('edit-description').value = task.description;
    editModal.style.display = 'flex';
}

document.getElementById('save-edit').addEventListener('click', () => {
    const newTitle = document.getElementById('edit-title').value.trim();
    const newDesc = document.getElementById('edit-description').value.trim();

    if (newTitle.length >= 3) {
        tasks = tasks.map(t => 
            t.id === currentEditingId ? { ...t, title: newTitle, description: newDesc } : t
        );
        closeModal();
        saveAndRender();
    }
});

document.getElementById('cancel-edit').addEventListener('click', closeModal);

function closeModal() {
    editModal.style.display = 'none';
    currentEditingId = null;
}

// 6. Función "Búsqueda" 
document.getElementById('search-bar').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = tasks.filter(t => t.title.toLowerCase().includes(term));
    // Re-renderizado simple para búsqueda
    taskList.innerHTML = '';
    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <div class="task-content">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
            </div>
            <div class="task-actions">
                <button class="btn-edit" onclick="openEditModal(${task.id})">Editar</button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;
        taskList.appendChild(li);
    });

// 7. Mejoras
function saveAndRender() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderTasks();
}
});
