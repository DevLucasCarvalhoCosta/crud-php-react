<?php
declare(strict_types=1);

namespace App\Domain;

final class Pessoa extends Entidade
{
    public function __construct(
        public string $nome,
        public string $cpf,
        public ?string $rg = null,
        public ?string $cep = null,
        public ?string $logradouro = null,
        public ?string $complemento = null,
        public ?string $setor = null,
        public ?string $cidade = null,
        public ?string $uf = null,
        public array $telefones = [],
        ?int $id = null,
    ) {
        parent::__construct($id);
    }

    public function paraArray(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'cpf' => $this->cpf,
            'rg' => $this->rg,
            'cep' => $this->cep,
            'logradouro' => $this->logradouro,
            'complemento' => $this->complemento,
            'setor' => $this->setor,
            'cidade' => $this->cidade,
            'uf' => $this->uf,
            'telefones' => array_map(
                static fn (Telefone $t) => $t->paraArray(),
                $this->telefones
            ),
        ];
    }

    public static function hidratar(array $linha): static
    {
        return new static(
            nome: (string) $linha['nome'],
            cpf: (string) $linha['cpf'],
            rg: $linha['rg'] ?? null,
            cep: $linha['cep'] ?? null,
            logradouro: $linha['logradouro'] ?? null,
            complemento: $linha['complemento'] ?? null,
            setor: $linha['setor'] ?? null,
            cidade: $linha['cidade'] ?? null,
            uf: $linha['uf'] ?? null,
            id: isset($linha['id']) ? (int) $linha['id'] : null,
        );
    }
}
