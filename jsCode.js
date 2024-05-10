document.querySelector('.burger-menu').addEventListener('click', function() {
    this.classList.toggle('active');
    let icon = document.querySelector('.burger-menu i');
    if (icon.classList.contains('bi-list')) {
        icon.classList.remove('bi-list');
        icon.classList.add('bi-x');
    } else {
        icon.classList.remove('bi-x');
        icon.classList.add('bi-list');
    }
    document.querySelector('.sidebar').classList.toggle('open');
});


document.querySelector('.content').addEventListener('click', function(event) {
    const addOrEditButton = event.target.closest("button.addOrEdit");
    if (addOrEditButton) {
        clearModalErrors();
        openAddEditModalWindow(addOrEditButton);
    }
});

document.querySelector('.content').addEventListener('click', function(event) {
    const deleteRowButton = event.target.closest("button.deleteRow");
    if (deleteRowButton) {
        openWarningModalWindow(deleteRowButton);
    }
});
function getRowByDataAttribute(attributeName, attributeValue) {
    const table = document.getElementById('studentsTable');
    const rows = table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.getAttribute(attributeName) == attributeValue) {
            return row;
        }
    }
    return null;
}
function clearModalErrors() {
    document.getElementById("genderSelect").classList.remove("is-invalid");
    document.getElementById("firstName").classList.remove("is-invalid");
    document.getElementById("lastName").classList.remove("is-invalid");
    document.getElementById("groupSelect").classList.remove("is-invalid");
    document.getElementById("birthdateInput").classList.remove("is-invalid");
}


let Student = {
    id: null,
    group: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthday: "",
    status: false,
};

document.addEventListener("DOMContentLoaded", function() {


    document.querySelector('.modal-header .close').addEventListener('click', function () {
        let modal = bootstrap.Modal.getInstance(document.getElementById("AddStudentModalWindow"));
        modal.hide();
    });

    document.getElementById("AddEditForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const statusRadio = document.querySelector('input[name="statusRadio"]:checked');

        // Create student object
        let student = {
            id: document.getElementById("studentId").value,
            group: document.getElementById("groupSelect").value,
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            gender: document.getElementById("genderSelect").value,
            birthday: document.getElementById("birthdateInput").value,
            status: statusRadio ? (statusRadio.value === 'active' ? 1 : 0) : 0
        };
        let receivedStudent;
        $.ajax({
            url: 'server.php',
            type: 'POST',
            data: student,
            dataType: 'json',
            success: function (data) {
                clearModalErrors();
                if (!data.status) {
                    const field = document.getElementById(data.error.type);
                    field.classList.add("is-invalid");
                    field.nextElementSibling.innerHTML = data.error.message;
                } else {
                    receivedStudent = data.student;
                    receivedStudent.status = receivedStudent.status === "1" ? true : false;
                    if (student.id === "") {
                        addStudent(receivedStudent);
                    } else {
                        editStudent(receivedStudent);
                    }
                    let jsonString = createFormData(receivedStudent)
                    console.log(jsonString);
                    let modal = bootstrap.Modal.getInstance(document.getElementById("AddStudentModalWindow"));
                    modal.hide();
                }
            },
            error: function (xhr, status, error) {
                console.error(status + ': ' + error);
            }
        });

    });

    document.getElementById("confirmDeleteStudent").addEventListener('click', function () {

        const stdId = document.getElementById("idOfDelete").value;

        $.ajax({
            url: 'delete.php',
            type: 'POST',
            data: {'id': stdId},
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    const row = getRowByDataAttribute('data-id', stdId);
                    row.parentNode.removeChild(row);
                    let modal = bootstrap.Modal.getInstance(document.getElementById("deleteConfirmationModal"));
                    modal.hide();
                } else {
                    alert("Error deleting item: " + data.error);
                }
            },
            error: function (xhr, status, error) {
                console.error(status + ': ' + error);
            }
        });
    });

    });

    function fillModalWindow(student) {
        document.getElementById("studentId").value = student.id ? student.id : "";
        document.getElementById("groupSelect").value = student.group;
        document.getElementById("firstName").value = student.firstName;
        document.getElementById("lastName").value = student.lastName;
        document.getElementById("genderSelect").value = student.gender;
        document.getElementById("birthdateInput").value = student.birthday ? formatDateToISO(student.birthday) : "";

        const activeRadio = document.getElementById("activeRadio");
        const inactiveRadio = document.getElementById("inactiveRadio");

        if (student.status === true) {
            activeRadio.checked = true; // Встановлюємо активний статус
        } else if (student.status === false) {
            inactiveRadio.checked = true; // Встановлюємо неактивний статус
        } else {
            activeRadio.checked = false;
            inactiveRadio.checked = false;
        }
    }

    function addStudent(student) {
    const newRow = document.createElement('tr');
    newRow.setAttribute("data-id", student.id);
    newRow.innerHTML = `
        <td><input type="checkbox" class="table-input"></td>
        <td data-value="${student.group}">${document.querySelector('#groupSelect option[value="' + student.group + '"]').textContent}</td>
        <td data-firstName="${student.firstName}" data-lastName="${student.lastName}">${student.firstName + " " + student.lastName}</td>
        <td data-value="${student.gender}">${document.querySelector('#genderSelect option[value="' + student.gender + '"]').textContent}</td>
        <td>${formatDate(student.birthday)}</td>
        <td>${student.status ? '<i class="bi bi-circle-fill" id="icon-active"></i>' : '<i class="bi bi-circle-fill" id="icon"></i>'}</td>
        <td>
            <button class="btn btn-xs addOrEdit" data-id="${student.id}"><i class="bi bi-pencil-square Icon"></i></button>
            <button class="btn btn-xs deleteRow" data-id="${student.id}"><i class="bi bi-x-square Icon"></i></button>
        </td>
    `;
    document.getElementById('studentsTable').getElementsByTagName('tbody')[0].appendChild(newRow);
}


    function editStudent(editStudent) {
    const statusRadio = document.querySelector('input[name="statusRadio"]:checked');

    editStudent = {
        id: document.getElementById("studentId").value,
        group: document.getElementById("groupSelect").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        gender: document.getElementById("genderSelect").value,
        birthday: document.getElementById("birthdateInput").value,
        status: statusRadio ? statusRadio.value === 'active' : false
    };
    const table = document.getElementById('studentsTable');
    const rows = table.getElementsByTagName('tr');
    let rowToEdit;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.getAttribute('data-id') == editStudent.id) {
            rowToEdit = row;
        }
    }
    const cols = rowToEdit.querySelectorAll('td');

    cols[1].setAttribute("data-value", editStudent.group);
    cols[1].textContent = document.querySelector('#groupSelect option[value="' + editStudent.group + '"]').textContent;
    cols[2].textContent = editStudent.firstName + " " + editStudent.lastName;
    cols[2].setAttribute("data-firstName", editStudent.firstName);
    cols[2].setAttribute("data-lastName", editStudent.lastName);
    cols[3].setAttribute("data-value", editStudent.gender);
    cols[3].textContent = document.querySelector('#genderSelect option[value="' + editStudent.gender + '"]').textContent;
    cols[4].textContent = formatDate(editStudent.birthday);
    cols[5].innerHTML = editStudent.status ? '<i class="bi bi-circle-fill" id="icon-active"></i>' : '<i class="bi bi-circle-fill" id="icon"></i>';

}

    let openAddEditModalWindow = function (button) {
        let student = Object.assign({}, Student);
        let title = "Add student";
        if (button.getAttribute("data-id") !== "") {
            title = "Edit student";
            let tr = button.closest('tr');
            let columns = tr.querySelectorAll('td');
            student.id = tr.getAttribute("data-id");

            student.group = columns[1].getAttribute("data-value");

            student.firstName = columns[2].getAttribute("data-firstName");
            student.lastName = columns[2].getAttribute("data-lastName");

            student.gender = columns[3].getAttribute("data-value");

            student.birthday = columns[4].textContent;
            // Check for active status icon and set student.status accordingly
            const statusCell = columns[5];
            const isActiveIcon = statusCell.querySelector('i.bi.bi-circle-fill#icon-active');
            student.status = isActiveIcon !== null; // Set true if icon exists, false otherwise
        }
        fillModalWindow(student);
        document.getElementById("ModalTitle").innerText = title;

        let modal = new bootstrap.Modal(document.getElementById('AddStudentModalWindow'));
        modal.show();

    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); // Додаємо нуль спереду, якщо число менше 10
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Місяці в JavaScript починаються з 0
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    function formatDateToISO(dateString) {
        let parts = dateString.split('.');

        return parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0');
    }

    function openWarningModalWindow(button) {
        let tr = button.closest('tr');
        let columns = tr.querySelectorAll('td');
        let name = columns[2].textContent.trim();
        document.getElementById("idOfDelete").value = button.getAttribute("data-id");
        document.getElementById("messageForDelete").innerText = "Are you sure you want to delete the student " + name + "?";
        let modal = new bootstrap.Modal(document.getElementById("deleteConfirmationModal"));

        modal.show();
    }

    function createFormData(student) {
        const formData = {
            id: student.id,
            group: student.group,
            firstName: student.firstName,
            lastName: student.lastName,
            gender: student.gender,
            birthdate: student.birthday,
            status: student.status
        }
        return JSON.stringify(formData);
    }
