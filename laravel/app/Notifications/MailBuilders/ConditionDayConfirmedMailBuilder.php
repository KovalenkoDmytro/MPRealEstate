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
            ->greeting("Hello {$notifiable->name},")
            ->line("The seller has confirmed the condition day for your deal on \"{$this->deal->listing->title}\".")
            ->line("📅 Confirmed Condition Day: {$this->deal->condition_day->format('F j, Y')}")
            ->action('View Deal', url("/deals/{$this->deal->id}"))
            ->line("Thank you for continuing the transaction process.");
    }
}
