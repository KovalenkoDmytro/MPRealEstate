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
            ->subject("Deposit Marked as Made for {$this->deal->listing->title}")
            ->greeting("Hello {$notifiable->name},")
            ->line("The buyer has marked their security deposit as made for the listing \"{$this->deal->listing->title}\".")
            ->action('View Deal', url("/deals/{$this->deal->id}"))
            ->line("Please log in to verify and confirm receipt.");
    }
}
