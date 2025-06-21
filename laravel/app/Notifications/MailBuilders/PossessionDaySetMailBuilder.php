<?php

namespace App\Notifications\MailBuilders;

use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;
use App\Notifications\Contracts\MailableContentBuilderInterface;


class PossessionDaySetMailBuilder implements MailableContentBuilderInterface
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
            ->line("The buyer has set the possession day for your deal on \"{$this->deal->listing->title}\".")
            ->line("📅 Possession Day: {$this->deal->possession_day->format('F j, Y')}")
            ->action('View Deal', url("/deals/{$this->deal->id}"))
            ->line("Please review and confirm when ready.");
    }
}
