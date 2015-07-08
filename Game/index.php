<?php
session_start();

if(!isset($_SESSION['user_id']))
{
    if(isset($_COOKIE['user_id']) && isset($_COOKIE['user_name']))
    {
        $_SESSION['user_id'] = $_COOKIE['user_id'];
        $_SESSION['user_name'] = $_COOKIE['user_name'];
    }
}

if(isset($_SESSION['user_name']))
{
    echo '<div style="text-align:right;">You are logged as ' . $_SESSION['user_name'] . '<br>';
    echo '<a href="..\..\logout.php"> Log out(' . $_SESSION['user_name'] . ')</a></div>';
}
else
{
    $home_url = '..\..\login.php';
    header('Location:' . $home_url);
}
?>

<html>
<head>
    <meta charset="utf-8">
    <title>Dimention Wars</title>
    <link rel="icon" type="image/GIF" href="res/favicon.ico"/>
    <meta name="viewport" content="width=321,user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="full-screen" content="yes"/>
    <meta name="screen-orientation" content="portrait"/>
    <meta name="x5-fullscreen" content="true"/>
    <meta name="360-fullscreen" content="true"/>
    <style>
        body, canvas, div {
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            -khtml-user-select: none;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
    </style>
    <script src="../CCBoot.js"></script>
    <script src="main.js"></script>
</head>
<body style="padding:0; margin: 0; background: #000;">
<script src="res/loading.js"></script>
<canvas id="gameCanvas" width="321" height="480"></canvas>
</body>
</html>