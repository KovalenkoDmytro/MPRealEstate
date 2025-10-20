<?php

use Illuminate\Support\Str;
use App\Models\User;

if (!function_exists('generateUniqueLawyerNumber')) {
    function generateUniqueLawyerNumber(): string
    {
        do {
            $randomNumber = strtoupper(Str::random(6));
            $lawyerNumber = 'LW-' . date('Y') . '-' . $randomNumber;
        } while (User::where('lawyer_number', $lawyerNumber)->exists());

        return $lawyerNumber;
    }
}
