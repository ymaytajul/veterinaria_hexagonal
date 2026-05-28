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

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Dependencias
$pdo = new PDO(
    "mysql:host={$_ENV['DB_HOST']};port={$_ENV['DB_PORT']};dbname={$_ENV['DB_NAME']}",
    $_ENV['DB_USER'],
    $_ENV['DB_PASS']
);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$repositorio = new Infrastructure\RepositorioCitasMySQL($pdo);
$gestionCitas = new Application\GestionCitasImpl($repositorio);
$controller = new Infrastructure\CitaController($gestionCitas);

return $controller;