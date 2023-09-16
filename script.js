const todoList = document.getElementById('todo-list');
const todoDoneList = document.getElementById('todo-done-list');
const todoNameInput = document.getElementById('todo-name');
const todoDescriptionInput = document.getElementById('todo-description');
const addTodoButton = document.getElementById('add-todo');

// Load todo items and done items from localStorage when the page loads
window.addEventListener('load', () => {
    loadTodoItems();
    loadDoneItems();
});

addTodoButton.addEventListener('click', () => {
    const name = todoNameInput.value.trim();
    const description = todoDescriptionInput.value.trim();

    if (name === '') return;

    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span>${name} - ${description}</span>
        <div class="actions">
            <button class="done">✓</button>
            <button class="delete">✗</button>
        </div>
    `;

    todoList.appendChild(listItem);

    todoNameInput.value = '';
    todoDescriptionInput.value = '';

    // Save the todo item to localStorage
    saveTodoItem({ name, description });

    // Add event listeners for done and delete buttons
    const doneButton = listItem.querySelector('.done');
    doneButton.addEventListener('click', () => {
        listItem.style.backgroundColor = '#d0ffd0'; // Mark as done
        moveItemToDone(listItem);

        // Move the todo item to done in localStorage
        const todoItem = { name, description };
        removeTodoItem(todoItem);
        saveDoneItem(todoItem);
    });

    const deleteButton = listItem.querySelector('.delete');
    deleteButton.addEventListener('click', () => {
        todoList.removeChild(listItem); // Remove the item
        // Remove the todo item from localStorage
        removeTodoItem({ name, description });
    });
});

function moveItemToDone(item) {
    const doneItem = item.cloneNode(true);
    doneItem.querySelector('.done').remove(); // Remove the done button in the done list
    doneItem.querySelector('.delete').remove(); // Remove the delete button in the done list
    todoDoneList.appendChild(doneItem);
}

function saveTodoItem(todo) {
    const todoItems = getTodoItems();
    todoItems.push(todo);
    localStorage.setItem('todos', JSON.stringify(todoItems));
}

function removeTodoItem(todo) {
    const todoItems = getTodoItems();
    const index = todoItems.findIndex(item => item.name === todo.name && item.description === todo.description);
    if (index !== -1) {
        todoItems.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todoItems));
    }
}

function saveDoneItem(todo) {
    const doneItems = getDoneItems();
    doneItems.push(todo);
    localStorage.setItem('done', JSON.stringify(doneItems));
}

function loadTodoItems() {
    const todoItems = getTodoItems();
    todoItems.forEach(todo => {
        const listItem = createListItem(todo);
        todoList.appendChild(listItem);
        attachEventListeners(listItem, todo);
    });
}

function loadDoneItems() {
    const doneItems = getDoneItems();
    doneItems.forEach(todo => {
        const listItem = createListItem(todo);
        listItem.style.backgroundColor = '#d0ffd0'; // Mark as done
        todoDoneList.appendChild(listItem);
        attachEventListeners(listItem, todo);
    });
}

function getTodoItems() {
    const todoItemsJSON = localStorage.getItem('todos');
    return todoItemsJSON ? JSON.parse(todoItemsJSON) : [];
}

function getDoneItems() {
    const doneItemsJSON = localStorage.getItem('done');
    return doneItemsJSON ? JSON.parse(doneItemsJSON) : [];
}

function createListItem(todo) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span>${todo.name} - ${todo.description}</span>
        <div class="actions">
            <button class="done">✓</button>
            <button class="delete">✗</button>
        </div>
    `;
    return listItem;
}

function attachEventListeners(listItem, todo) {
    const doneButton = listItem.querySelector('.done');
    doneButton.addEventListener('click', () => {
        listItem.style.backgroundColor = '#d0ffd0'; // Mark as done
        moveItemToDone(listItem);

        // Move the todo item to done in localStorage
        removeTodoItem(todo);
        saveDoneItem(todo);
    });

    const deleteButton = listItem.querySelector('.delete');
    deleteButton.addEventListener('click', () => {
        if (listItem.parentElement === todoList) {
            todoList.removeChild(listItem); // Remove the item from the todo list
            // Remove the todo item from localStorage
            removeTodoItem(todo);
        } else if (listItem.parentElement === todoDoneList) {
            todoDoneList.removeChild(listItem); // Remove the item from the done list
            // Remove the done item from localStorage
            removeDoneItem(todo);
        }
    });
}

function removeDoneItem(todo) {
    const doneItems = getDoneItems();
    const index = doneItems.findIndex(item => item.name === todo.name && item.description === todo.description);
    if (index !== -1) {
        doneItems.splice(index, 1);
        localStorage.setItem('done', JSON.stringify(doneItems));
    }
}
