<?php

use Illuminate\Support\Str;
use App\Models\User;

if (!function_exists('generateUniqueLawyerNumber')) {
    function generateUniqueLawyerNumber(): string
    {
        do {
            $code = strtoupper(Str::random(9)); // 9-character random alphanumeric string
        } while (User::where('lawyer_number', $code)->exists());

        return $code;
    }
}
