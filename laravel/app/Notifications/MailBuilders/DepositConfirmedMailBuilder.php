<?php

namespace App\Notifications\MailBuilders;

use App\Models\Deal;
use App\Notifications\Contracts\MailableContentBuilderInterface;
use Illuminate\Notifications\Messages\MailMessage;

class DepositConfirmedMailBuilder implements MailableContentBuilderInterface
{
    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function build($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('mainBuilders.depositConfirmed.subject', [
                'listingTitle' => $this->deal->listing->title,
            ]))
            ->greeting(__('mainBuilders.depositConfirmed.greeting', [
                'name' => $notifiable->name,
            ]))
            ->line(__('mainBuilders.depositConfirmed.lines.0', [
                'listingTitle' => $this->deal->listing->title,
            ]))
            ->action(
                __('mainBuilders.depositConfirmed.action.label'),
                url(str_replace(':dealId', $this->deal->id, __('mainBuilders.depositConfirmed.action.url')))
            )
            ->line(__('mainBuilders.depositConfirmed.lines.1'));
    }
}
