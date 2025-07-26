<?php

namespace App\Models;

use Spatie\Permission\Traits\HasRoles;

class Buyer extends User
{
    use HasRoles;
}
