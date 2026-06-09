<?php
// Zet alle foutmeldingen aan (handig voor development / debugging)
// E_ALL = toont alle soorten fouten en waarschuwingen
error_reporting(E_ALL);

// Zorgt dat fouten direct op het scherm worden weergegeven
ini_set('display_errors', 1);


// Maak verbinding met de MySQL database
// Parameters: host, username, password, database naam
$conn = new mysqli("localhost", "root", "", "brightlands");


// Controleer of de verbinding is gelukt
if ($conn->connect_error) {

    // Stop het script meteen als er een fout is en toon foutmelding
    die("Connectie fout: " . $conn->connect_error);
}


// Als de database verbinding goed werkt, toon dit bericht
echo "Database werkt!";
?>