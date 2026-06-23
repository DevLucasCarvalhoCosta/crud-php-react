<?php
declare(strict_types=1);

namespace App\Domain;

final class Telefone extends Entidade
{
    public function __construct(
        public string $telefone,
        public ?string $descricao = null,
        public ?int $pessoaId = null,
        ?int $id = null,
    ) {
        parent::__construct($id);
    }

    public function paraArray(): array
    {
        return [
            'id' => $this->id,
            'telefone' => $this->telefone,
            'descricao' => $this->descricao,
        ];
    }

    public static function hidratar(array $linha): static
    {
        return new static(
            telefone: (string) $linha['telefone'],
            descricao: $linha['descricao'] ?? null,
            pessoaId: isset($linha['pessoa_id']) ? (int) $linha['pessoa_id'] : null,
            id: isset($linha['id']) ? (int) $linha['id'] : null,
        );
    }
}
