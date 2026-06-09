<?php
// Start de sessie zodat we toegang hebben tot de huidige ingelogde gebruiker
session_start();


// Verwijdert alle sessie-data (dus gebruiker wordt volledig uitgelogd)
session_destroy();


// Stuur de gebruiker terug naar de login pagina
header("Location: login.php");


// Stop het script meteen zodat er niets meer wordt uitgevoerd
exit;
?>