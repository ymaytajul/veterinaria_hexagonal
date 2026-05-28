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

function loadEnv(string $path): void
{
    if (!is_readable($path)) {
        return;
    }

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') {
            continue;
        }

        [$name, $value] = array_pad(explode('=', $line, 2), 2, '');
        $name = trim($name);
        $value = trim($value, " \t\"'");

        if ($name === '' || getenv($name) !== false) {
            continue;
        }

        putenv("$name=$value");
        $_ENV[$name] = $value;
    }
}

function env(string $key, string $default = ''): string
{
    $value = $_ENV[$key] ?? getenv($key);

    if ($value === false || $value === null) {
        return $default;
    }

    return (string) $value;
}

loadEnv(__DIR__ . '/.env');

$dsn = sprintf(
    'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
    env('DB_HOST', 'localhost'),
    env('DB_PORT', '3306'),
    env('DB_NAME', 'veterinaria_hexagonal')
);

$pdo = new PDO($dsn, env('DB_USER', 'root'), env('DB_PASSWORD'));
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$repositorio = new Infrastructure\RepositorioCitasMySQL($pdo);
$gestionCitas = new Application\GestionCitasImpl($repositorio);
$controller = new Infrastructure\CitaController($gestionCitas);

return $controller;
