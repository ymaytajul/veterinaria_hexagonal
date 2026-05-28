<?php
// Autoloader
spl_autoload_register(function ($class) {
    $prefixes = [
        'Domain\\' => __DIR__ . '/Domain/',
        'Application\\' => __DIR__ . '/Application/',
        'Infrastructure\\' => __DIR__ . '/Infrastructure/',
    ];
    foreach ($prefixes as $prefix => $base_dir) {
        if (strpos($class, $prefix) === 0) {
            $file = $base_dir . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
            if (file_exists($file)) require $file;
        }
    }
});

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;



// Dependencias
$pdo = new PDO(
    "mysql:host=" . getenv('DB_HOST') . ";port=" . getenv('DB_PORT') . ";dbname=" . getenv('DB_NAME'),
    getenv('DB_USER'),
    getenv('DB_PASSWORD')
);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$repositorio = new Infrastructure\RepositorioCitasMySQL($pdo);
$gestionCitas = new Application\GestionCitasImpl($repositorio);
$controller = new Infrastructure\CitaController($gestionCitas);

return $controller;