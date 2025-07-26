<?php

namespace App\Models;

use Spatie\Permission\Traits\HasRoles;

class Lawyer extends User
{
    use HasRoles;
}
