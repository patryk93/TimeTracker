const apikey = '1bfefb6e-93ce-4a5d-94f4-0d9a36b1aca5';
const apihost = 'https://todo-api.coderslab.pl';

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

    if(status === 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    headerRightDiv.appendChild(deleteButton);

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';
    section.appendChild(ul);

    //toDo
    //lista


    if(status === 'open') {
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

        const divInputGroupAppend = document.createElement('div');
        divInputGroupAppend.className = 'input-group-append';
        divInputGroup.appendChild(divInputGroupAppend);

        const addButton = document.createElement('button');
        addButton.className = 'btn btn-info';
        addButton.innerText = 'Add';
        divInputGroupAppend.appendChild(addButton);
    }




    const button15m = document.createElement('button');
    button15m.className = 'btn btn-outline-success btn-sm mr-2';
    button15m.innerText = '+15m';

}

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + '/api/tasks' + taskId + '/operations',
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

function renderOperation() {

}

document.addEventListener('DOMContentLoaded', function() {
    apiListTasks().then(
        function(response) {

            //open function renderTask for all tasks from backend
            response.data.forEach(
                function(task) { renderTask(task.id, task.title, task.description, task.status); }
            );

        }
    );
});