// url api
const url = 'https://flyleague.org/api/';
// кнопка добавление новой задачи
let addTaskBtn;

// получение чекбоксов
const getAllToDosCheckboxes = () => document.querySelectorAll('input[type=checkbox]');

function checkboxesToggle() {
    let allCheckboxes = getAllToDosCheckboxes();
    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', () => checkbox.nextSibling.classList.toggle())
    });
}

// создание формы для идентификации автора тасков
function createAuthorForm() {
    const authorForm = document.createElement('div');
    const authorInput = document.createElement('input');
    const authorButton = document.createElement('button');
    const hr = document.createElement('hr');

    authorInput.className = 'author-input';
    authorInput.type = 'text';
    authorForm.className = 'author-form';
    authorButton.className = 'author-btn'
    authorButton.innerText = 'AuthAuth';

    authorForm.append(authorInput);
    authorForm.append(authorButton);
    authorForm.append(hr);
    document.body.append(authorForm);
}

// создание формы таски
function createTaskForm() {
    const addTaskForm = document.createElement('div');
    const inputTaskText = document.createElement('input');
    const addTaskButton = document.createElement('button');
    // const tasksContainer = document.querySelector('.todos-container');
    // const authorForm = document.querySelector('.author-form');
    const taskCheck = document.createElement('input');

    addTaskForm.className = 'add-task-form';
    addTaskButton.className = 'task-btn';
    addTaskButton.innerText = 'Добавить';
    inputTaskText.className = 'task-input';
    taskCheck.id = 'new-task';
    taskCheck.type = 'checkbox';
    addTaskForm.style.display = 'none';

    // tasksContainer.append(taskCheck);
    // tasksContainer.append(inputTaskText);
    // tasksContainer.append(addTaskButton);
    addTaskForm.append(taskCheck);
    addTaskForm.append(inputTaskText);
    addTaskForm.append(addTaskButton);
    document.body.append(addTaskForm);
}

// основная функция для работы приложения
const setAuthorInLocalStorage = async () => {
    // переменная для хранения имени автора полученная из поля input
    let author = document.querySelector('.author-input').value;
    if(author) {
        localStorage.setItem('name', author);
        // получает id автора
        let authorId = await createAuthor(url, localStorage.getItem('name'))
                                                .then(res => res.json()
                                                .then(data => data.data.id));
        // получает todos определённого автора
        let allToDos = await getAllToDos(authorId).then(res => res.json()).then(data => data.data);
        // рисует todos
        createToDosForm(allToDos);
        // форма для добавления таски
        addTaskBtn = document.querySelector('.task-btn');

        async function addNewTask() {
            let newTask = document.querySelector('.task-input').value;
            let isChecked = document.querySelector('#new-task');
    
            let newTaskId = async () => await createTask(url, authorId, {
                'text': `${newTask}`,
                'is_done': isChecked.checked
            });
            
            await newTaskId();
            allToDos = await getAllToDos(authorId).then(res => res.json()).then(data => data.data);
            createToDosForm(allToDos);
            document.querySelector('.task-input').value = '';
            document.querySelector('#new-task').checked = false;
        }

        addTaskBtn.addEventListener('click', addNewTask);
        console.log(getAllToDosCheckboxes());
    }
}

// получает id автора и создаёт его, если его не было
const createAuthor = async (url, name) => fetch(url + 'authors', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({name})
});

// получение всех todos
const getAllToDos = async (authorId) => fetch(url + 'tasks/' + authorId, {
    method: 'GET'
});

// отрисовка todos
function createToDosForm(data) {
    const nodeToDos = document.createElement('div');
    nodeToDos.className = 'todos-container';
    const container = document.querySelector('.todos-container');
    const authorForm = document.querySelector('.author-form');
    const addTaskForm = document.querySelector('.add-task-form');
    addTaskForm.style.display = 'block';

    if (container) container.outerHTML = '';

    data.forEach((element) => {
        let toDosCheck = document.createElement('input');
        toDosCheck.type = 'checkbox';
        toDosCheck.checked = element.is_done ? 'checked' : '';

        let toDosForm = document.createElement('div');
        toDosForm.className = 'todos-form';

        let toDosInput = document.createElement('input');
        toDosInput.className = 'todos-input';
        toDosInput.type = 'text';
        toDosInput.disabled = 'disabled';
        toDosInput.value = element.text;

        toDosForm.append(toDosCheck);
        toDosForm.append(toDosInput);
        nodeToDos.append(toDosForm);
    });
    authorForm.append(nodeToDos);
};

// создание новой таски
const createTask = async (url, authorId, task) => fetch(url + 'tasks/' + authorId, {
    method: 'POST',
    headers : {
        'Content-type': 'application/json'
    },
    body: JSON.stringify(task)
});

(function main() {
    createAuthorForm();
    createTaskForm();

    const button = document.querySelector('.author-btn');
    
    button.addEventListener('click', setAuthorInLocalStorage);
})();