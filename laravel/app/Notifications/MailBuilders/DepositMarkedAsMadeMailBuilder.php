<?php

namespace App\Notifications\MailBuilders;

use App\Models\Deal;
use App\Notifications\Contracts\MailableContentBuilderInterface;
use Illuminate\Notifications\Messages\MailMessage;

class DepositMarkedAsMadeMailBuilder implements MailableContentBuilderInterface
{
    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function build($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('mainBuilders.depositMarkedAsMade.subject', [
                'listingTitle' => $this->deal->listing->title,
            ]))
            ->greeting(__('mainBuilders.depositMarkedAsMade.greeting', [
                'name' => $notifiable->name,
            ]))
            ->line(__('mainBuilders.depositMarkedAsMade.lines.0', [
                'listingTitle' => $this->deal->listing->title,
            ]))
            ->action(
                __('mainBuilders.depositMarkedAsMade.action.label'),
                url(str_replace(':dealId', $this->deal->id, __('mainBuilders.depositMarkedAsMade.action.url')))
            )
            ->line(__('mainBuilders.depositMarkedAsMade.lines.1'));
    }
}
