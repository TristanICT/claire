<?php
// Start sessie zodat we gebruikersgegevens kunnen opslaan na login
session_start();


// Zet foutmeldingen aan (handig tijdens development)
ini_set('display_errors', 1);
error_reporting(E_ALL);


// Maak verbinding met MySQL database "brightlands"
$conn = new mysqli("localhost", "root", "", "brightlands");


// Controleer of database verbinding is gelukt
if ($conn->connect_error) {

    // Stop script en toon fout als database niet werkt
    die("Database fout: " . $conn->connect_error);
}


// Variabele voor feedback (zoals foutmelding login)
$message = "";


// Controleer of formulier is verzonden (POST request)
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Haal email op uit formulier en verwijder spaties
    $email = trim($_POST['email'] ?? '');

    // Haal wachtwoord op uit formulier
    $password = $_POST['password'] ?? '';

    // Check of beide velden ingevuld zijn
    if (!$email || !$password) {

        // Foutmelding als velden leeg zijn
        $message = "Vul alle velden in.";

    } else {

        // Zoek gebruiker in database op basis van email
        $stmt = $conn->prepare("
            SELECT id, voornaam, achternaam, bedrijfsnaam, password
            FROM users
            WHERE email = ?
            LIMIT 1
        ");

        // Vul de ? in met email (veilig tegen SQL injection)
        $stmt->bind_param("s", $email);

        // Voer query uit
        $stmt->execute();

        // Haal resultaat op
        $result = $stmt->get_result();


        // Controleer of er 1 gebruiker gevonden is
        if ($result->num_rows === 1) {

            // Zet database resultaat om naar array
            $user = $result->fetch_assoc();

            // Controleer wachtwoord (hashed password check)
            if (password_verify($password, $user['password'])) {

                // Login succesvol → sla gebruikersdata op in sessie
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['voornaam'] = $user['voornaam'];
                $_SESSION['achternaam'] = $user['achternaam'];
                $_SESSION['bedrijfsnaam'] = $user['bedrijfsnaam'];

                // Redirect naar dashboard
                header("Location: dashboard.php");
                exit;

            } else {
                // Wachtwoord klopt niet
                $message = "Onjuist wachtwoord.";
            }

        } else {
            // Geen gebruiker gevonden met dit emailadres
            $message = "Geen account gevonden met dit e-mailadres.";
        }

        // Sluit database statement
        $stmt->close();
    }
}


// Sluit database verbinding
$conn->close();
?>

<!DOCTYPE html>
<html lang="nl">
<head>

<meta charset="UTF-8">
<!-- Zorgt dat speciale tekens goed werken -->

<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Responsive design voor mobiel -->

<title>Inloggen - Brightlands</title>

<!-- Google font laden -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style>

/* ===== RESET ===== */
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

/* ===== ACHTERGROND PAGINA ===== */
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

/* Decoratieve groene blur cirkels */
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

/* ===== LOGIN CARD ===== */
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

/* Logo icoon */
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

/* Titel */
h2{
    color:white;
    text-align:center;
    font-size:30px;
    font-weight:700;
    margin-bottom:8px;
}

/* Subtekst */
.sub{
    text-align:center;
    color:rgba(255,255,255,.75);
    margin-bottom:30px;
    font-size:14px;
}

/* Input container */
.input-group{
    margin-bottom:18px;
}

/* Input velden */
input{
    width:100%;
    padding:15px 18px;
    border:none;
    border-radius:14px;
    background:rgba(255,255,255,.92);
    font-size:15px;
}

/* Focus effect op input */
input:focus{
    outline:none;
    box-shadow:
        0 0 0 4px rgba(34,197,94,.25),
        0 10px 20px rgba(0,0,0,.08);
}

/* Login knop */
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

/* Hover effect knop */
button:hover{
    transform:translateY(-2px);
}

/* Foutmelding box */
.msg{
    padding:14px;
    border-radius:14px;
    margin-bottom:20px;
    text-align:center;
    font-size:14px;
}

/* Styling voor error melding */
.error{
    background:rgba(254,226,226,.95);
    color:#991b1b;
}

/* Footer tekst */
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
    <!-- Slot icoon voor login -->

    <h2>Inloggen</h2>

    <div class="sub">
        Log in op jouw Brightlands account
    </div>

    <!-- Laat foutmelding zien als die bestaat -->
    <?php if($message): ?>
        <div class="msg error">
            <?= htmlspecialchars($message) ?>
        </div>
    <?php endif; ?>

    <!-- LOGIN FORMULIER -->
    <form method="POST">

        <div class="input-group">
            <input type="email" name="email" placeholder="E-mailadres" required>
        </div>

        <div class="input-group">
            <input type="password" name="password" placeholder="Wachtwoord" required>
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