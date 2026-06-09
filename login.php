<?php
session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

$conn = new mysqli("localhost", "root", "", "brightlands");

if ($conn->connect_error) {
    die("Database fout: " . $conn->connect_error);
}

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (!$email || !$password) {

        $message = "Vul alle velden in.";

    } else {

        $stmt = $conn->prepare("
            SELECT id, voornaam, achternaam, bedrijfsnaam, password
            FROM users
            WHERE email = ?
            LIMIT 1
        ");

        $stmt->bind_param("s", $email);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows === 1) {

            $user = $result->fetch_assoc();

            if (password_verify($password, $user['password'])) {

                $_SESSION['user_id'] = $user['id'];
                $_SESSION['voornaam'] = $user['voornaam'];
                $_SESSION['achternaam'] = $user['achternaam'];
                $_SESSION['bedrijfsnaam'] = $user['bedrijfsnaam'];

                header("Location: dashboard.php");
                exit;

            } else {
                $message = "Onjuist wachtwoord.";
            }

        } else {
            $message = "Geen account gevonden met dit e-mailadres.";
        }

        $stmt->close();
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Inloggen - Brightlands</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:'Poppins',sans-serif;
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    overflow:hidden;

    background:
        linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.65)),
        url("https://immx.nl/wp-content/uploads/2024/10/clair-2-226x300.jpg");

    background-size:cover;
    background-position:center;
    position:relative;
}

body::before,
body::after{
    content:"";
    position:absolute;
    border-radius:50%;
    filter:blur(80px);
}

body::before{
    width:300px;
    height:300px;
    background:#22c55e;
    top:-80px;
    left:-80px;
    opacity:.35;
}

body::after{
    width:250px;
    height:250px;
    background:#16a34a;
    bottom:-80px;
    right:-80px;
    opacity:.25;
}

.card{
    position:relative;
    z-index:1;

    width:100%;
    max-width:430px;

    padding:40px;

    border-radius:28px;

    background:rgba(255,255,255,.12);
    backdrop-filter:blur(18px);

    border:1px solid rgba(255,255,255,.18);

    box-shadow:
        0 20px 50px rgba(0,0,0,.35),
        inset 0 1px 1px rgba(255,255,255,.15);
}

.logo{
    width:70px;
    height:70px;

    margin:0 auto 20px;

    border-radius:20px;

    background:linear-gradient(135deg,#22c55e,#16a34a);

    display:flex;
    align-items:center;
    justify-content:center;

    font-size:30px;

    box-shadow:0 10px 25px rgba(34,197,94,.4);
}

h2{
    color:white;
    text-align:center;
    font-size:30px;
    font-weight:700;
    margin-bottom:8px;
}

.sub{
    text-align:center;
    color:rgba(255,255,255,.75);
    margin-bottom:30px;
    font-size:14px;
}

.input-group{
    margin-bottom:18px;
}

input{
    width:100%;
    padding:15px 18px;

    border:none;
    border-radius:14px;

    background:rgba(255,255,255,.92);

    font-size:15px;
}

input:focus{
    outline:none;

    box-shadow:
        0 0 0 4px rgba(34,197,94,.25),
        0 10px 20px rgba(0,0,0,.08);
}

button{
    width:100%;
    padding:15px;

    border:none;
    border-radius:14px;

    background:linear-gradient(135deg,#22c55e,#16a34a);

    color:white;
    font-size:16px;
    font-weight:600;

    cursor:pointer;

    box-shadow:0 12px 24px rgba(34,197,94,.35);
}

button:hover{
    transform:translateY(-2px);
}

.msg{
    padding:14px;
    border-radius:14px;
    margin-bottom:20px;
    text-align:center;
    font-size:14px;
}

.error{
    background:rgba(254,226,226,.95);
    color:#991b1b;
}

.footer{
    margin-top:22px;
    text-align:center;
    color:rgba(255,255,255,.7);
    font-size:13px;
}

.footer a{
    color:#86efac;
    text-decoration:none;
    font-weight:600;
}

.footer a:hover{
    text-decoration:underline;
}

</style>
</head>

<body>

<div class="card">

    <div class="logo">🔐</div>

    <h2>Inloggen</h2>

    <div class="sub">
        Log in op jouw Brightlands account
    </div>

    <?php if($message): ?>
        <div class="msg error">
            <?= htmlspecialchars($message) ?>
        </div>
    <?php endif; ?>

    <form method="POST">

        <div class="input-group">
            <input
                type="email"
                name="email"
                placeholder="E-mailadres"
                required
            >
        </div>

        <div class="input-group">
            <input
                type="password"
                name="password"
                placeholder="Wachtwoord"
                required
            >
        </div>

        <button type="submit">
            Inloggen
        </button>

    </form>

    <div class="footer">
        Nog geen account?
        <a href="register.php">Registreren</a>
    </div>

</div>

</body>
</html>