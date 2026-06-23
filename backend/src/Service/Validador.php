<?php
declare(strict_types=1);

namespace App\Service;

final class Validador
{
    public static function somenteDigitos(string $valor): string
    {
        return preg_replace('/\D+/', '', $valor) ?? '';
    }

    public static function cpfValido(string $cpf): bool
    {
        $cpf = self::somenteDigitos($cpf);

        if (strlen($cpf) !== 11) {
            return false;
        }
        if (preg_match('/^(\d)\1{10}$/', $cpf)) {
            return false;
        }

        for ($t = 9; $t < 11; $t++) {
            $soma = 0;
            for ($i = 0; $i < $t; $i++) {
                $soma += (int) $cpf[$i] * (($t + 1) - $i);
            }
            $dv = (10 * $soma) % 11;
            $dv = ($dv === 10) ? 0 : $dv;
            if ($dv !== (int) $cpf[$t]) {
                return false;
            }
        }

        return true;
    }
}
