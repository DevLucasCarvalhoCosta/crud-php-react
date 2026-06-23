<?php
declare(strict_types=1);

namespace App\Repository;

use App\Domain\Entidade;
use App\Domain\Telefone;

final class TelefoneRepository extends AbstractRepository
{
    protected function tabela(): string
    {
        return 'telefone';
    }

    protected function hidratar(array $linha): Entidade
    {
        return Telefone::hidratar($linha);
    }

    public function salvar(Entidade $entidade): int
    {
        \assert($entidade instanceof Telefone);
        $stmt = $this->pdo()->prepare(
            'INSERT INTO telefone (pessoa_id, telefone, descricao) VALUES (?, ?, ?)'
        );
        $stmt->execute([$entidade->pessoaId, $entidade->telefone, $entidade->descricao]);
        return (int) $this->pdo()->lastInsertId();
    }

    public function listarPorPessoa(int $pessoaId): array
    {
        $stmt = $this->pdo()->prepare(
            'SELECT * FROM telefone WHERE pessoa_id = ? ORDER BY id'
        );
        $stmt->execute([$pessoaId]);
        return array_map(
            static fn (array $l) => Telefone::hidratar($l),
            $stmt->fetchAll()
        );
    }

    public function salvarLote(int $pessoaId, array $telefones): void
    {
        $pdo = $this->pdo();
        $pdo->prepare('DELETE FROM telefone WHERE pessoa_id = ?')->execute([$pessoaId]);

        $ins = $pdo->prepare(
            'INSERT INTO telefone (pessoa_id, telefone, descricao) VALUES (?, ?, ?)'
        );
        foreach ($telefones as $t) {
            if (trim($t->telefone) === '') {
                continue;
            }
            $ins->execute([$pessoaId, $t->telefone, $t->descricao]);
        }
    }
}
