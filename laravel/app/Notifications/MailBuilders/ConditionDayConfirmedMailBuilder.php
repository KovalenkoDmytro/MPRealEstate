<?php

namespace App\Notifications\MailBuilders;

use App\Models\Deal;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Contracts\MailableContentBuilderInterface;

class ConditionDayConfirmedMailBuilder implements MailableContentBuilderInterface
{
    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function build($notifiable): MailMessage
    {
        return (new MailMessage)
            ->greeting(__('mainBuilders.conditionDaySet.greeting', [
                'name' => $notifiable->name,
            ]))
            ->line(__('mainBuilders.conditionDaySet.lines.0', [
                'listingTitle' => $this->deal->listing->title,
            ]))
            ->line(__('mainBuilders.conditionDaySet.lines.1', [
                'conditionDay' => $this->deal->condition_day->format('F j, Y'),
            ]))
            ->action(__('mainBuilders.conditionDaySet.action.label'), url("/deals/{$this->deal->id}"))
            ->line(__('mainBuilders.conditionDaySet.closing'));
    }
}
