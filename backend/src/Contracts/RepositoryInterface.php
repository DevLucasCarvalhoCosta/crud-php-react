<?php
declare(strict_types=1);

namespace App\Contracts;

use App\Domain\Entidade;

interface RepositoryInterface
{
    public function salvar(Entidade $entidade): int;

    public function buscarPorId(int $id): ?Entidade;

    public function listarTodos(): array;

    public function excluir(int $id): void;
}
