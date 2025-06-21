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
            ->greeting("Hello {$notifiable->name},")
            ->line("Your possession day for the listing \"{$this->deal->listing->title}\" has been confirmed by the seller.")
            ->line("📅 Confirmed Possession Day: {$this->deal->possession_day->format('F j, Y')}")
            ->action('View Deal Details', url("/deals/{$this->deal->id}"))
            ->line("Please prepare for the next steps in your property transaction.");
    }
}
