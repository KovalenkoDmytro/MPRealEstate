<?php

namespace App\Services;

use App\Models\User ;

class LawyerService
{
    private User $lawyer;

    public function __construct(User $lawyer)
    {
        $this->lawyer = $lawyer;
    }

    public function getDealsStatistics(): array
    {
        return [
            'closed_deals'  => $this->lawyer->getClosedDeals()->count(),
            'pending_deals' => $this->lawyer->getPendingDeals()->count(),
        ];
    }
}

