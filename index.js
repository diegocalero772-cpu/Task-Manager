// 1. Estructura de datos
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
let currentEditingId = null;

// 2. Referencias a elementos del DOM
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list-container');
const taskCounter = document.getElementById('task-counter');
const editModal = document.getElementById('edit-modal');
const searchBar = document.getElementById('search-bar');

// 3. Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});

// 4. Renderizado 
function renderTasks(tasksToDisplay = tasks) {
    taskList.innerHTML = '';
    taskCounter.textContent = `Tareas pendientes: ${tasks.length}`;

    if (tasksToDisplay.length === 0) {
        const mensaje = tasks.length === 0 ? 'No hay tareas aún' : 'No hay coincidencias';
        taskList.innerHTML = `<li style="text-align:center; color:#94a3b8; padding:20px; list-style:none;">${mensaje}</li>`;
        return;
    }

    tasksToDisplay.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        li.innerHTML = `
            <div class="task-content">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
            </div>
            <div class="task-actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Eliminar</button>
            </div>
        `;

        li.querySelector('.btn-delete').onclick = () => deleteTask(task.id);
        li.querySelector('.btn-edit').onclick = () => openEditModal(task.id);

        taskList.appendChild(li);
    });
}

// 5. Añadir tarea
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    
    if (validateForm(title, description)) {
        const newTask = { id: Date.now(), title, description };
        tasks.push(newTask);
        updateStorage(); 
        searchBar.value = ''; 
        renderTasks(); 
        taskForm.reset();
    }
});

// 6. Validaciones
function validateForm(title, description) {
    let isValid = true;
    const exists = tasks.some(t => t.title.toLowerCase() === title.toLowerCase());

    if (title.length < 3) {
        document.getElementById('title-error').textContent = 'Mínimo 3 letras';
        isValid = false;
    } else if (exists) {
        document.getElementById('title-error').textContent = 'Título ya existe';
        isValid = false;
    } else {
        document.getElementById('title-error').textContent = '';
    }

    if (description.length > 100) {
        document.getElementById('desc-error').textContent = 'Máx 100 caracteres';
        isValid = false;
    } else {
        document.getElementById('desc-error').textContent = '';
    }
    return isValid;
}

// 7. Eliminar tarea
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    updateStorage();
    ejecutarBusqueda(); 
}

// 8. Lógica del Modal (Abrir/Cerrar/Guardar)
function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    currentEditingId = id;
    document.getElementById('edit-title').value = task.title;
    document.getElementById('edit-description').value = task.description;
    
    // Mostramos el modal con flex para que se centre
    editModal.style.display = 'flex';
}

function closeModal() {
    editModal.style.display = 'none';
    currentEditingId = null;
}

// Evento para cerrar si se pulsa el botón cancelar
document.getElementById('cancel-edit').onclick = closeModal;

// Cerrar modal si el usuario hace clic fuera del contenido blanco
window.onclick = (event) => {
    if (event.target == editModal) {
        closeModal();
    }
};

// Guardar cambios de edición
document.getElementById('save-edit').onclick = () => {
    const newTitle = document.getElementById('edit-title').value.trim();
    const newDesc = document.getElementById('edit-description').value.trim();

    if (newTitle.length >= 3) {
        tasks = tasks.map(t => 
            t.id === currentEditingId ? { ...t, title: newTitle, description: newDesc } : t
        );
        updateStorage();
        closeModal();
        ejecutarBusqueda(); 
    } else {
        alert("El título debe tener al menos 3 caracteres.");
    }
};

// 9. Búsqueda
searchBar.addEventListener('input', ejecutarBusqueda);

function ejecutarBusqueda() {
    const term = searchBar.value.toLowerCase();
    const filtered = tasks.filter(t => 
        t.title.toLowerCase().includes(term) || 
        t.description.toLowerCase().includes(term)
    );
    renderTasks(filtered);
}

// 10. Persistencia
function updateStorage() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}