<?php

namespace App\Notifications\MailBuilders;

use App\Models\Deal;
use App\Notifications\Contracts\MailableContentBuilderInterface;
use Illuminate\Notifications\Messages\MailMessage;

class DealBreakRequestedApprovedMailBuilder implements MailableContentBuilderInterface
{
    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function build($notifiable): MailMessage
    {

        return (new MailMessage)
            ->subject('Deal Break Request Has been Approved')
            ->greeting('Hello ' . $notifiable->name)
            ->line("A request to break the deal: {$this->deal->name} has been approved.");
    }
}
