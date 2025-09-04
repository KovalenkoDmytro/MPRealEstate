<?php

namespace App\Notifications\MailBuilders;

use App\Models\Deal;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Contracts\MailableContentBuilderInterface;

class PossessionDayConfirmedMailBuilder implements MailableContentBuilderInterface
{
    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function build($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('mainBuilders.possessionDayConfirmed.subject'))
            ->greeting(__('mainBuilders.possessionDayConfirmed.greeting', [
                'name' => $notifiable->name,
            ]))
            ->line(__('mainBuilders.possessionDayConfirmed.lines.0', [
                'listingTitle' => $this->deal->listing->title,
            ]))
            ->line(__('mainBuilders.possessionDayConfirmed.lines.1', [
                'possessionDay' => $this->deal->possession_day->format('F j, Y'),
            ]))
            ->action(
                __('mainBuilders.possessionDayConfirmed.action.label'),
                url(str_replace(':dealId', $this->deal->id, __('mainBuilders.possessionDayConfirmed.action.url')))
            )
            ->line(__('mainBuilders.possessionDayConfirmed.lines.2'));
    }
}
