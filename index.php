<?php
$controller = require_once __DIR__ . '/bootstrap.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = explode('/', trim($_SERVER['PATH_INFO'] ?? '/', '/'));

try {
    
    if ($method === 'GET' && $path[0] === 'citas' && !isset($path[1])) {
        echo json_encode($controller->listar());
    }
    elseif ($method === 'POST' && $path[0] === 'citas') {
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode($controller->crear($data));
    }
    elseif ($method === 'PUT' && $path[0] === 'citas' && isset($path[2]) && $path[2] === 'confirmar') {
        echo json_encode($controller->confirmar($path[1]));
    }
    elseif ($method === 'PUT' && $path[0] === 'citas' && isset($path[2]) && $path[2] === 'cancelar') {
        echo json_encode($controller->cancelar($path[1]));
    }
    else {
        http_response_code(404);
        echo json_encode(['error' => 'Ruta no encontrada']);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}