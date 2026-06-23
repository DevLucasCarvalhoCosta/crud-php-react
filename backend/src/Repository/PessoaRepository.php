<?php
declare(strict_types=1);

namespace App\Repository;

use App\Domain\Entidade;
use App\Domain\Pessoa;

final class PessoaRepository extends AbstractRepository
{
    public function __construct(
        private TelefoneRepository $telefones = new TelefoneRepository(),
    ) {}

    protected function tabela(): string
    {
        return 'pessoa';
    }

    protected function hidratar(array $linha): Entidade
    {
        return Pessoa::hidratar($linha);
    }

    public function buscarPorId(int $id): ?Entidade
    {
        $pessoa = parent::buscarPorId($id);
        if ($pessoa instanceof Pessoa) {
            $pessoa->telefones = $this->telefones->listarPorPessoa($id);
        }
        return $pessoa;
    }

    public function listarTodos(): array
    {
        $pessoas = parent::listarTodos();
        foreach ($pessoas as $p) {
            if ($p instanceof Pessoa) {
                $p->telefones = $this->telefones->listarPorPessoa((int) $p->id);
            }
        }
        return $pessoas;
    }

    public function salvar(Entidade $entidade): int
    {
        \assert($entidade instanceof Pessoa);
        $pdo = $this->pdo();

        if ($entidade->id === null) {
            $stmt = $pdo->prepare(
                'INSERT INTO pessoa (nome, cpf, rg, cep, logradouro, complemento, setor, cidade, uf)
                 VALUES (:nome, :cpf, :rg, :cep, :logradouro, :complemento, :setor, :cidade, :uf)'
            );
            $stmt->execute($this->colunas($entidade));
            return (int) $pdo->lastInsertId();
        }

        $stmt = $pdo->prepare(
            'UPDATE pessoa SET nome=:nome, cpf=:cpf, rg=:rg, cep=:cep, logradouro=:logradouro,
             complemento=:complemento, setor=:setor, cidade=:cidade, uf=:uf WHERE id=:id'
        );
        $stmt->execute($this->colunas($entidade) + ['id' => $entidade->id]);
        return $entidade->id;
    }

    private function colunas(Pessoa $p): array
    {
        return [
            'nome' => $p->nome, 'cpf' => $p->cpf, 'rg' => $p->rg, 'cep' => $p->cep,
            'logradouro' => $p->logradouro, 'complemento' => $p->complemento,
            'setor' => $p->setor, 'cidade' => $p->cidade, 'uf' => $p->uf,
        ];
    }
}
