<?php
declare(strict_types=1);

namespace App\Http;

final class Router
{
    private array $rotas = [];

    public function add(string $metodo, string $padrao, callable $handler): void
    {
        $regex = '#^' . preg_replace('#\{(\w+)\}#', '(?P<$1>[^/]+)', $padrao) . '$#';
        $this->rotas[] = ['metodo' => $metodo, 'regex' => $regex, 'handler' => $handler];
    }

    public function dispatch(string $metodo, string $uri): void
    {
        $caminho = parse_url($uri, PHP_URL_PATH) ?: '/';
        foreach ($this->rotas as $r) {
            if ($r['metodo'] !== $metodo) {
                continue;
            }
            if (preg_match($r['regex'], $caminho, $m)) {
                $params = array_filter($m, 'is_string', ARRAY_FILTER_USE_KEY);
                ($r['handler'])($params);
                return;
            }
        }
        http_response_code(404);
        echo json_encode(['erro' => 'Rota não encontrada']);
    }
}
