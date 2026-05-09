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
    renderTasks(); // Muestra las tareas al cargar
});

// 4. Renderizado 
function renderTasks(tasksToDisplay = tasks) {
    taskList.innerHTML = '';
    
    // Actualizacion del contador de tareas
    taskCounter.textContent = `Tareas pendientes: ${tasks.length}`;

    if (tasksToDisplay.length === 0) {
        const mensaje = tasks.length === 0 ? 'No hay tareas aún' : 'No hay coincidencias';
        taskList.innerHTML = `<li style="text-align:center; color:#888; padding:20px; list-style:none;">${mensaje}</li>`;
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

        // Eventos directos para evitar errores de ID
        li.querySelector('.btn-delete').onclick = () => deleteTask(task.id);
        li.querySelector('.btn-edit').onclick = () => openEditModal(task.id);

        taskList.appendChild(li);
    });
}

// 5. Función "añadir tarea"
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
        document.getElementById('desc-error').textContent = 'Muy larga (máx 100)';
        isValid = false;
    } else {
        document.getElementById('desc-error').textContent = '';
    }

    return isValid;
}

// 7. Función "eliminar tarea"
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    updateStorage();
    // Ejecución de búsqueda para mantener el filtro activo después de eliminar
    ejecutarBusqueda(); 
}

// 8. Fúncion "editar tarea"
function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    currentEditingId = id;
    document.getElementById('edit-title').value = task.title;
    document.getElementById('edit-description').value = task.description;
    editModal.style.display = 'flex';
}

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
    }
};

document.getElementById('cancel-edit').onclick = closeModal;

function closeModal() {
    editModal.style.display = 'none';
    currentEditingId = null;
}

// 9. Lógica de búsqueda
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