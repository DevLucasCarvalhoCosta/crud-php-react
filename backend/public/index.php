<?php
declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

use App\Http\PessoaController;
use App\Http\Router;

$envFile = __DIR__ . '/../.env';
if (is_file($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $linha) {
        if (str_starts_with(trim($linha), '#') || !str_contains($linha, '=')) {
            continue;
        }
        [$k, $v] = explode('=', $linha, 2);
        putenv(trim($k) . '=' . trim($v));
    }
}

$origin = getenv('CORS_ORIGIN') ?: '*';
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$controller = new PessoaController();

$router = new Router();
$router->add('GET', '/', function () {
    http_response_code(200);
    echo json_encode(['status' => 'ok', 'service' => 'crud-pessoas-api']);
});
$router->add('GET',    '/api/pessoas',      fn () => $controller->index());
$router->add('GET',    '/api/pessoas/{id}', fn (array $p) => $controller->show($p));
$router->add('POST',   '/api/pessoas',      fn () => $controller->store());
$router->add('PUT',    '/api/pessoas/{id}', fn (array $p) => $controller->update($p));
$router->add('DELETE', '/api/pessoas/{id}', fn (array $p) => $controller->destroy($p));

$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
