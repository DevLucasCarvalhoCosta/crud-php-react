<?php
declare(strict_types=1);

namespace App\Domain;

abstract class Entidade
{
    public function __construct(public ?int $id = null) {}

    abstract public function paraArray(): array;

    abstract public static function hidratar(array $linha): static;
}
