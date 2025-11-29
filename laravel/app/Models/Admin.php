<?php

namespace App\Models;

use Spatie\Permission\Traits\HasRoles;


class Admin extends User
{
    use HasRoles;

    protected $table = 'users';
}
