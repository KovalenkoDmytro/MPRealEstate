<?php

namespace App\Services;

use App\Models\User;

class LawyerService
{
    public function getAllDealsForLawyer(User $lawyer)
    {
        return $lawyer->deals()
            ->with(['users', 'realEstateListing.mainImage', 'realEstateListing.images', 'files'])
            ->get();
    }


}
