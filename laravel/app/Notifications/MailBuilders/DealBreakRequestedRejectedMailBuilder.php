<?php

namespace App\Notifications\MailBuilders;

use App\Models\Deal;
use App\Notifications\Contracts\MailableContentBuilderInterface;
use Illuminate\Notifications\Messages\MailMessage;

class DealBreakRequestedRejectedMailBuilder implements MailableContentBuilderInterface
{
    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function build($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('mainBuilders.dealBreakRequestedRejected.subject'))
            ->greeting(__('mainBuilders.dealBreakRequestedRejected.greeting', [
                'name' => $notifiable->name,
            ]))
            ->line(__('mainBuilders.dealBreakRequestedRejected.lines.0', [
                'deal' => $this->deal->name,
            ]))
            ->action(
                __('mainBuilders.dealBreakRequestedRejected.action.label'),
                url(str_replace(':dealId', $this->deal->id, __('mainBuilders.dealBreakRequestedRejected.action.url')))
            );
    }
}
