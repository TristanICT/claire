<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$conn = new mysqli("localhost", "root", "", "brightlands");

if ($conn->connect_error) {
    die("Database fout: " . $conn->connect_error);
}

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $voornaam = trim($_POST['voornaam'] ?? '');
    $achternaam = trim($_POST['achternaam'] ?? '');
    $bedrijfsnaam = trim($_POST['bedrijfsnaam'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password_raw = $_POST['password'] ?? '';

    if (!$voornaam || !$achternaam || !$bedrijfsnaam || !$email || !$password_raw) {
        $message = "Vul alle velden in.";
    } else {

        $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $check->bind_param("s", $email);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            $message = "Dit e-mailadres is al geregistreerd.";
        } else {

            $password = password_hash($password_raw, PASSWORD_DEFAULT);

            $stmt = $conn->prepare("
                INSERT INTO users (voornaam, achternaam, bedrijfsnaam, email, password)
                VALUES (?, ?, ?, ?, ?)
            ");

            $stmt->bind_param("sssss", $voornaam, $achternaam, $bedrijfsnaam, $email, $password);

            if ($stmt->execute()) {
                $message = "Registratie gelukt!";
            } else {
                $message = "Fout: " . $stmt->error;
            }

            $stmt->close();
        }

        $check->close();
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Registreren - Brightlands</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:'Poppins', sans-serif;
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    overflow:hidden;

    background:
        linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)),
        url("https://immx.nl/wp-content/uploads/2024/10/clair-2-226x300.jpg");

    background-size:cover;
    background-position:center;
    position:relative;
}

/* subtiele blur circles */

body::before,
body::after{
    content:"";
    position:absolute;
    border-radius:50%;
    filter:blur(80px);
    z-index:0;
}

body::before{
    width:300px;
    height:300px;
    background:#22c55e;
    top:-80px;
    left:-80px;
    opacity:0.35;
}

body::after{
    width:250px;
    height:250px;
    background:#16a34a;
    bottom:-80px;
    right:-80px;
    opacity:0.25;
}

.card{
    position:relative;
    z-index:1;

    width:100%;
    max-width:430px;

    padding:40px;

    border-radius:28px;

    background:rgba(255,255,255,0.12);
    backdrop-filter:blur(18px);

    border:1px solid rgba(255,255,255,0.18);

    box-shadow:
        0 20px 50px rgba(0,0,0,0.35),
        inset 0 1px 1px rgba(255,255,255,0.15);

    animation:fadeUp .7s ease;
}

@keyframes fadeUp{
    from{
        opacity:0;
        transform:translateY(20px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
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

    box-shadow:0 10px 25px rgba(34,197,94,0.4);
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
    color:rgba(255,255,255,0.75);
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

    background:rgba(255,255,255,0.92);

    font-size:15px;

    transition:0.25s ease;
}

input:focus{
    outline:none;
    transform:translateY(-2px);

    box-shadow:
        0 0 0 4px rgba(34,197,94,0.25),
        0 10px 20px rgba(0,0,0,0.08);
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

    transition:0.3s ease;

    box-shadow:0 12px 24px rgba(34,197,94,0.35);
}

button:hover{
    transform:translateY(-2px) scale(1.01);

    box-shadow:0 18px 30px rgba(34,197,94,0.45);
}

button:active{
    transform:scale(.98);
}

.msg{
    padding:14px;
    border-radius:14px;
    margin-bottom:20px;
    font-size:14px;
    text-align:center;
    font-weight:500;
}

.success{
    background:rgba(220,252,231,0.95);
    color:#166534;
}

.error{
    background:rgba(254,226,226,0.95);
    color:#991b1b;
}

.footer{
    margin-top:22px;
    text-align:center;
    color:rgba(255,255,255,0.7);
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

@media(max-width:500px){

    .card{
        margin:20px;
        padding:30px 24px;
        border-radius:24px;
    }

    h2{
        font-size:26px;
    }

}

</style>
</head>

<body>

<div class="card">

    <div class="logo">🌱</div>

    <h2>Welkom</h2>

    <div class="sub">
        Maak jouw Brightlands account aan
    </div>

    <?php if ($message): ?>
        <div class="msg <?= strpos($message, 'gelukt') !== false ? 'success' : 'error'; ?>">
            <?= htmlspecialchars($message) ?>
        </div>
    <?php endif; ?>

    <form method="POST">

        <div class="input-group">
            <input type="text" name="voornaam" placeholder="Voornaam" required>
        </div>

        <div class="input-group">
            <input type="text" name="achternaam" placeholder="Achternaam" required>
        </div>

        <div class="input-group">
            <input type="text" name="bedrijfsnaam" placeholder="Bedrijfsnaam" required>
        </div>

        <div class="input-group">
            <input type="email" name="email" placeholder="E-mailadres" required>
        </div>

        <div class="input-group">
            <input type="password" name="password" placeholder="Wachtwoord" required minlength="6">
        </div>

        <button type="submit">
            Account aanmaken
        </button>

    </form>

    <div class="footer">
        Heb je al een account?
        <a href="login.php">Inloggen</a>
    </div>

</div>

</body>
</html>