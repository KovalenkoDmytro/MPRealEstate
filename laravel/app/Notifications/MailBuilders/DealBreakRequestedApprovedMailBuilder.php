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
            ->subject(__('mainBuilders.dealBreakRequestedApproved.subject'))
            ->greeting(__('mainBuilders.dealBreakRequestedApproved.greeting', [
                'name' => $notifiable->name,
            ]))
            ->line(__('mainBuilders.dealBreakRequestedApproved.lines.0', [
                'deal' => $this->deal->name,
            ]));
    }
}
