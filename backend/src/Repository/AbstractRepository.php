<?php
declare(strict_types=1);

namespace App\Repository;

use App\Contracts\RepositoryInterface;
use App\Core\Database;
use App\Domain\Entidade;
use PDO;

abstract class AbstractRepository implements RepositoryInterface
{
    protected function pdo(): PDO
    {
        return Database::getConnection();
    }

    abstract protected function tabela(): string;

    abstract protected function hidratar(array $linha): Entidade;

    public function buscarPorId(int $id): ?Entidade
    {
        $stmt = $this->pdo()->prepare("SELECT * FROM {$this->tabela()} WHERE id = ?");
        $stmt->execute([$id]);
        $linha = $stmt->fetch();
        return $linha === false ? null : $this->hidratar($linha);
    }

    public function listarTodos(): array
    {
        $rows = $this->pdo()
            ->query("SELECT * FROM {$this->tabela()} ORDER BY id DESC")
            ->fetchAll();
        return array_map(fn (array $l) => $this->hidratar($l), $rows);
    }

    public function excluir(int $id): void
    {
        $stmt = $this->pdo()->prepare("DELETE FROM {$this->tabela()} WHERE id = ?");
        $stmt->execute([$id]);
    }
}
