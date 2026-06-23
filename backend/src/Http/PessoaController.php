<?php
declare(strict_types=1);

namespace App\Http;

use App\Service\PessoaService;
use InvalidArgumentException;

final class PessoaController extends Controller
{
    public function __construct(
        private PessoaService $service = new PessoaService(),
    ) {}

    public function index(): void
    {
        $payload = array_map(
            static fn ($p) => $p->paraArray(),
            $this->service->listar()
        );
        $this->json(200, $payload);
    }

    public function show(array $params): void
    {
        $pessoa = $this->service->buscar((int) $params['id']);
        $pessoa === null
            ? $this->json(404, ['erro' => 'Pessoa não encontrada'])
            : $this->json(200, $pessoa->paraArray());
    }

    public function store(): void
    {
        try {
            $pessoa = $this->service->gravar($this->lerCorpo());
            $this->json(201, $pessoa->paraArray());
        } catch (InvalidArgumentException $e) {
            $this->json(422, ['erro' => $e->getMessage()]);
        } catch (\Throwable) {
            $this->json(500, ['erro' => 'Erro ao gravar']);
        }
    }

    public function update(array $params): void
    {
        if ($this->service->buscar((int) $params['id']) === null) {
            $this->json(404, ['erro' => 'Pessoa não encontrada']);
            return;
        }

        try {
            $pessoa = $this->service->gravar($this->lerCorpo(), (int) $params['id']);
            $this->json(200, $pessoa->paraArray());
        } catch (InvalidArgumentException $e) {
            $this->json(422, ['erro' => $e->getMessage()]);
        } catch (\Throwable) {
            $this->json(500, ['erro' => 'Erro ao atualizar']);
        }
    }

    public function destroy(array $params): void
    {
        $this->service->excluir((int) $params['id']);
        $this->json(204, null);
    }
}
