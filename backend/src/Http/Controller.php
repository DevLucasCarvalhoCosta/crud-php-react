<?php
declare(strict_types=1);

namespace App\Http;

abstract class Controller
{
    protected function lerCorpo(): array
    {
        $raw = file_get_contents('php://input') ?: '';
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    protected function json(int $status, mixed $payload): void
    {
        http_response_code($status);
        if ($payload !== null) {
            echo json_encode($payload, JSON_UNESCAPED_UNICODE);
        }
    }
}
