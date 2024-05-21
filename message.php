<!DOCTYPE html>
<html lang="en">
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="style.css">
    <link rel="stylesheet" type="text/css" href="chat.css">
    <link rel="manifest" href="/manifest.json">
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <title>Messages</title>
    <meta charset="UTF-8">
</head>
<body>
<header class="navbar">
    <div class="burger-menu">
        <i class="bi bi-list"></i>
    </div>
    <span class="logo"><a class="CMSLogo">CMS</a></span>
    <div class="right">
        <div class="notification navBarButton">
            <div>
                <a href="Messages.html"><i class="bi bi-bell" ></i></a>
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
            <li class="nav-item"><a class="nav-link" href="index.php">Students</a></li>
            <li class="nav-item"><a class="nav-link" href="Tasks.html">Tasks</a></li>
        </ul>
    </nav>
    <span class="header-students">Messages</span>
</main>
<br><br>
<div class="chat-container">
    <div id="userNameArea">
        <form id="userForm" action="" class="sticky-bottom">
            <div class="form-group">
                <h4>Enter your name:</h4>
                <input id="username" autocomplete="off" />
                <button type="submit"><span class="material-symbols-outlined">chat</span></button>
            </div>
        </form>
    </div>
    <div class="chat-body">
        <div id="chatArea">
            <div class="online-users" id="online-users-div">
                <h3>Online Users</h3>
                <div class="user-list-el" id="global-chat">All</div>
                <ul id="users"></ul>
            </div>
            <div class="chat-window">
                <h3 id="chatInfo">Chat: all</h3>
                <div class="chat" id="chat"></div>
                <form id="messageForm">
                    <div class="form-group">
                        <label for="message">Enter message:</label>
                        <input type="text" id="message" autocomplete="off" />
                        <button type="submit">Send</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>


</body>

<script src="jsCode.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"/>
<script src="https://cdn.socket.io/4.0.1/socket.io.js"></script>
<script src="chat.js"></script>


</html>