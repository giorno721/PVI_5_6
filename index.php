<!DOCTYPE html>
<html lang="en">
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="manifest" href="/manifest.json">
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <title>Students</title>
    <meta charset="UTF-8">
</head>
<body>
<?php include("config.php") ?>

<header class="navbar">
    <div class="burger-menu">
        <i class="bi bi-list"></i>
    </div>
    <span class="logo"><a class="CMSLogo">CMS</a></span>
    <div class="right">
        <div class="notification navBarButton">
            <div>
                <a href="message.php"><i class="bi bi-bell" ></i></a>
            </div>
            <div class="navigationRedDot"></div>
            <div id="NotificationDropDownMenu">
                <ul>
                    <li>
                        <img class="img-notif" src="notification-image.png" alt="notification-image">
                        <button>Notification 1</button>
                        <span class="notif-text">Admin</span>
                    </li>
                    <li>
                        <img class="img-notif" src="notification-image.png" alt="notification-image">
                        <button>Notification 2</button>
                        <span class="notif-text">Admin</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="profile navBarButton">
            <a href="#"><img class="img-profile" src="user%20-profile%20image.png" alt="profile-image"></a>
            <div id="profileDropDownMenu">
                <ul>
                    <li><button>Profile</button></li>
                    <li><button>Log Out</button></li>
                </ul>
            </div>
            <label id="NameLabel">James Bond</label>
        </div>

    </div>
</header>
<main>
    <nav class="sidebar" style="float: left;">
        <ul class = "nav flex-column">
            <li class="nav-item"><a class="nav-link" href="Dashboard.html">Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" href="index.html">Students</a></li>
            <li class="nav-item"><a class="nav-link" href="Tasks.html">Tasks</a></li>
        </ul>
    </nav>
    <div class="content">
        <span class="header-students">Students</span>
        <br>
        <div class="text-end">
            <button class="btn btn-icon bi bi-plus-square addOrEdit" data-id="">
                <i class="Icon"></i>
            </button>
        </div>

        <br>
        <div class="table-container">
            <table id="studentsTable" class="content-table">
                <caption>
                </caption>
                <thead>
                <tr>
                    <th><label><input type="checkbox"></label></th><!--header cell-->
                    <th>Group</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Birthday</th>
                    <th>Status</th>
                    <th>Options</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <?php include("readDB.php"); ?>
                </tbody>
            </table>
        </div>
    </div>
</main>
<br><br>
<nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    </ul>
</nav>
<div class="modal fade" id="AddStudentModalWindow" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <form id="AddEditForm">
                <div class="modal-header">
                    <h5 class="modal-title" id="ModalTitle">Add student</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input type = hidden id="studentId">
                    <div class="form-group">
                        <label for="groupSelect">Group</label>
                        <select class="form-select" id="groupSelect">
                            <option value="" disabled selected hidden>Select the group</option>
                            <?php foreach ($groups as $key => $value): ?>
                                <option value="<?php echo $key; ?>"><?php echo $value; ?></option>
                            <?php endforeach; ?>
                        </select>
                        <div class="invalid-feedback"></div>
                    </div>
                    <div class="form-group">
                        <label for="firstName">Name</label>
                        <input type="text" class="form-control" id="firstName">
                        <div class="invalid-feedback"></div>

                    </div>
                    <div class="form-group">
                        <label for="lastName">Surname</label>
                        <input type="text" class="form-control" id="lastName">
                        <div class="invalid-feedback"></div>
                    </div>
                    <div class="form-group">
                        <label for="genderSelect">Gender</label>
                        <select class="form-select" id="genderSelect">
                            <option value="" disabled="" selected="" hidden="">Choose the gender</option>
                            <?php foreach ($genders as $key => $value): ?>
                                <option value="<?php echo $key; ?>"><?php echo $value ?></option>
                            <?php endforeach; ?>
                        </select>
                        <div class="invalid-feedback"></div>
                    </div>
                    <div class="form-group">
                        <label for="birthdateInput">Birth date</label>
                        <input type="date" class="form-control" id="birthdateInput">
                        <div class="invalid-feedback"></div>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="statusRadio" id="activeRadio" value="active">
                            <label class="form-check-label" for="activeRadio">
                                Active
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="statusRadio" id="inactiveRadio" value="inactive">
                            <label class="form-check-label" for="inactiveRadio">
                                Inactive
                            </label>
                        </div>
                        <br>
                        <div class="alert-msg">Some information is missing! Please, fill all the fields.</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button id="submitButton" class="btn btn-primary confirm-btn" type="submit">OK</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div class="modal fade show" id="deleteConfirmationModal" tabindex="-1" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteConfirmationModalLabel">Delete confirmation</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <input hidden id="idOfDelete">
            <div class="modal-body" id="messageForDelete">
                <p id="deleteConfirmationText">Are you sure you want to delete the student?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmDeleteStudent">Delete</button>
            </div>
        </div>
    </div>
</div>

</body>

<script src="jsCode.js"></script>
<script src="app.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<link rel="stylesheet" type="text/css" href="style.css">

</html>