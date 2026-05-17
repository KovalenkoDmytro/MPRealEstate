<?php

declare(strict_types=1);

namespace App\Actions\Demo;

use Inertia\Inertia;
use Inertia\Response;
use Lorisleiva\Actions\Concerns\AsController;

class ShowDemoPage
{
    use AsController;

    public function handle(): Response
    {
        return Inertia::render('Demo');
    }
}
