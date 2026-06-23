<?php
declare(strict_types=1);

namespace App\Service;

use App\Core\Database;
use App\Domain\Pessoa;
use App\Domain\Telefone;
use App\Repository\PessoaRepository;
use App\Repository\TelefoneRepository;
use InvalidArgumentException;

final class PessoaService
{
    public function __construct(
        private PessoaRepository $pessoas = new PessoaRepository(),
        private TelefoneRepository $telefones = new TelefoneRepository(),
    ) {}

    public function listar(): array
    {
        return $this->pessoas->listarTodos();
    }

    public function buscar(int $id): ?Pessoa
    {
        $p = $this->pessoas->buscarPorId($id);
        return $p instanceof Pessoa ? $p : null;
    }

    public function gravar(array $dados, ?int $id = null): Pessoa
    {
        $pessoa = $this->montar($dados, $id);

        $pdo = Database::getConnection();
        $pdo->beginTransaction();
        try {
            $novoId = $this->pessoas->salvar($pessoa);
            $this->telefones->salvarLote($novoId, $pessoa->telefones);
            $pdo->commit();
        } catch (\Throwable $e) {
            $pdo->rollBack();
            if ($this->ehViolacaoDeUnicidade($e)) {
                throw new InvalidArgumentException('CPF já cadastrado.', 0, $e);
            }
            throw $e;
        }

        return $this->buscar($novoId);
    }

    private function ehViolacaoDeUnicidade(\Throwable $e): bool
    {
        if (!$e instanceof \PDOException) {
            return false;
        }
        return $e->getCode() === '23505'
            || $e->getCode() === '23000'
            || stripos($e->getMessage(), 'unique') !== false;
    }

    public function excluir(int $id): void
    {
        $this->pessoas->excluir($id);
    }

    private function montar(array $d, ?int $id): Pessoa
    {
        $nome = trim((string) ($d['nome'] ?? ''));
        if ($nome === '') {
            throw new InvalidArgumentException('Nome é obrigatório.');
        }
        if (!Validador::cpfValido((string) ($d['cpf'] ?? ''))) {
            throw new InvalidArgumentException('CPF inválido.');
        }

        $telefones = [];
        foreach (($d['telefones'] ?? []) as $t) {
            $numero = Validador::somenteDigitos((string) ($t['telefone'] ?? ''));
            if ($numero === '') {
                continue;
            }
            $telefones[] = new Telefone($numero, $t['descricao'] ?? null);
        }

        return new Pessoa(
            nome: $nome,
            cpf: Validador::somenteDigitos((string) $d['cpf']),
            rg: $d['rg'] ?? null,
            cep: Validador::somenteDigitos((string) ($d['cep'] ?? '')) ?: null,
            logradouro: $d['logradouro'] ?? null,
            complemento: $d['complemento'] ?? null,
            setor: $d['setor'] ?? null,
            cidade: $d['cidade'] ?? null,
            uf: !empty($d['uf']) ? strtoupper(substr((string) $d['uf'], 0, 2)) : null,
            telefones: $telefones,
            id: $id,
        );
    }
}
