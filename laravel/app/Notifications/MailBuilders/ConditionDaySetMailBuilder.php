<?php

namespace App\Notifications\MailBuilders;

use App\Models\Deal;
use App\Notifications\Contracts\MailableContentBuilderInterface;
use Illuminate\Notifications\Messages\MailMessage;

class ConditionDaySetMailBuilder implements MailableContentBuilderInterface
{
    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function build($notifiable): MailMessage
    {
        return (new MailMessage)
            ->greeting("Hello {$notifiable->name},")
            ->line("The buyer has set the condition day for your deal on \"{$this->deal->listing->title}\".")
            ->line("📅 Condition Day: {$this->deal->condition_day->format('F j, Y')}")
            ->action('View Deal', url("/deals/{$this->deal->id}"))
            ->line("Please review the schedule and plan accordingly.");
    }
}
