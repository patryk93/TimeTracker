const apikey = '1bfefb6e-93ce-4a5d-94f4-0d9a36b1aca5'; //key needed to authorise to our API
const apihost = 'https://todo-api.coderslab.pl'; //source of backend

//function to show all tasks
function apiListTasks() {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('There is some error. Please open devtools and bookmark Network and find solution.');
            }
            return resp.json();
        }
    )
}

//function needed for apiListTasks to catch all elements
function renderTask(taskId, title, description, status) {
    const section = document.createElement('section');
    section.className = 'card mt-5 shadow-sm';
    document.querySelector('main').appendChild(section);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement('div');
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    h5.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);

    if (status === 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);

        finishButton.addEventListener('click', function() {
            apiUpdateTask(taskId, title, description, 'closed');
            section.querySelectorAll('.js-task-open-only').forEach(
                function(element) {
                    element.parentElement.removeChild(element);
                    h5.innerText = title + ' (fulfilled)';
                   }
            );
        });
    }
    else if (status === 'closed') {
        h5.innerText = title + ' (fulfilled)';
    }


    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    headerRightDiv.appendChild(deleteButton);

    //action after click delete button
    deleteButton.addEventListener('click', function () {
        apiDeleteTask(taskId).then(
            function () {
                section.parentElement.removeChild(section);
            }
        );
    });

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';
    section.appendChild(ul);

    //catch operations list of task from declared id of task
    apiListOperationsForTask(taskId).then(
        function (response) {
            response.data.forEach(
                function (operation) {
                    renderOperation(ul, status, operation.id, operation.description, operation.timeSpent);
                }
            );
        }
    );

    //works only if task is open
    if (status === 'open') {
        const divCardBody = document.createElement('div');
        divCardBody.className = 'card-body js-task-open-only';
        section.appendChild(divCardBody);

        const form = document.createElement('form');
        divCardBody.appendChild(form);

        const divInputGroup = document.createElement('div');
        divInputGroup.className = 'input-group';
        form.appendChild(divInputGroup);

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Operation description');
        input.setAttribute('minlength', '5');
        input.className = 'form-control';
        divInputGroup.appendChild(input);

        form.addEventListener('submit', function (event) {

            event.preventDefault();
            //create operation for task, get taskID and description
            apiCreateOperationForTask(taskId, input.value).then(
                //get rest of data
                function (response) {
                    renderOperation(ul, status, response.data.id, response.data.description, response.data.timeSpent);
                }
            );
        });

        const divInputGroupAppend = document.createElement('div');
        divInputGroupAppend.className = 'input-group-append';
        divInputGroup.appendChild(divInputGroupAppend);

        const addButton = document.createElement('button');
        addButton.className = 'btn btn-info';
        addButton.innerText = 'Add';
        divInputGroupAppend.appendChild(addButton);
    }
}

//needed to show operations of declared task by id
function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('There is some error. Please open devtools and bookmark Network and find solution.');
            }
            return resp.json();
        }
    )
}

//function to catch all operations for tasks and show it in proper way (used by apiListOperationsForTask)
function renderOperation(ul, status, operationId, operationDescription, operationTimeSpent) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    ul.appendChild(li);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);

    const time = document.createElement('span');
    time.className = 'badge badge-success badge-pill ml-2';
    time.innerText = formatTime(operationTimeSpent);
    descriptionDiv.appendChild(time);

    if (status === 'open') {
        const taskOpenDiv = document.createElement('div');
        taskOpenDiv.className = 'js-task-open-only';
        li.appendChild(taskOpenDiv);

        const add15mButton = document.createElement('button');
        add15mButton.className = 'btn btn-outline-success btn-sm mr-2';
        add15mButton.innerText = '+15m';
        taskOpenDiv.appendChild(add15mButton);

        add15mButton.addEventListener('click', function() {
            apiUpdateOperation(operationId, operationDescription, operationTimeSpent + 15).then(
                function(response) {
                    time.innerText = formatTime(response.data.timeSpent);
                    operationTimeSpent = response.data.timeSpent;
                }
            );
        });

        const add1hButton = document.createElement('button');
        add1hButton.className = 'btn btn-outline-success btn-sm mr-2';
        add1hButton.innerText = '+1h';
        taskOpenDiv.appendChild(add1hButton);

        add1hButton.addEventListener('click', function() {
            apiUpdateOperation(operationId, operationDescription, operationTimeSpent + 60).then(
                function(response) {
                    time.innerText = formatTime(response.data.timeSpent);
                    operationTimeSpent = response.data.timeSpent;
                }
            );
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-danger btn-sm';
        deleteButton.innerText = 'Delete';
        taskOpenDiv.appendChild(deleteButton);

        //action of the delete button
        deleteButton.addEventListener('click', function () {
            apiDeleteOperation(operationId).then(
                function () {
                    li.parentElement.removeChild(li);
                }
            );
        });

    }
}

//function used in function renderOperation to format date to good visible format:
function formatTime(time) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    if (hours > 0) {
        return hours + 'h ' + minutes + 'm';
    } else {
        return minutes + 'm';
    }
}

//function to Create new task:
function apiCreateTask(title, description) {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: 'open'}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('There is some error. Please open devtools and bookmark Network and find solution.');
            }
            return resp.json();
        }
    )
}

//delete task
function apiDeleteTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: {Authorization: apikey},
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('There is some error. Please open devtools and bookmark Network and find solution.');
            }
            return resp.json();
        }
    )
}

//create new operation
function apiCreateOperationForTask(taskId, description) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({description: description, timeSpent: 0}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('There is some error. Please open devtools and bookmark Network and find solution.');
            }
            return resp.json();
        }
    );
}

// delete operation from task
function apiDeleteOperation(operationId) {
    return fetch(
        apihost + '/api/operations/' + operationId,
        {
            headers: {Authorization: apikey},
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('There is some error. Please open devtools and bookmark Network and find solution.');
            }
            return resp.json();
        }
    )
}

//function for closing task
function apiUpdateTask(taskId, title, description, status) {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: description, status: status }),
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if(!resp.ok) {
                alert('There is some error. Please open devtools and bookmark Network and find solution.');
            }
            return resp.json();
        }
    );
}

function apiUpdateOperation(operationId, description, timeSpent) {
    return fetch(
        apihost + '/api/operations/' + operationId,
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: description, timeSpent: timeSpent }),
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if(!resp.ok) {
                alert('There is some error. Please open devtools and bookmark Network and find solution.');
            }
            return resp.json();
        }
    );
}


//event which works after page loaded:
document.addEventListener('DOMContentLoaded', function () {

    //load all tasks:
    apiListTasks().then(
        function (response) {
            //open function renderTask for all tasks from backend
            response.data.forEach(
                function (task) {
                    renderTask(task.id, task.title, task.description, task.status);
                }
            );
        }
    );

    //create new task:
    document.querySelector('.js-task-adding-form').addEventListener('submit', function (event) {
        event.preventDefault();

        apiCreateTask(event.target.elements.title.value, event.target.elements.description.value).then(
            function (response) {
                renderTask(response.data.id, response.data.title, response.data.description, response.data.status);
            }
        )
    });


});

