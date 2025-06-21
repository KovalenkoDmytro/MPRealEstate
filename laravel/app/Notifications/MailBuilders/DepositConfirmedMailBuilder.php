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
            ->subject("Deposit Confirmed for {$this->deal->listing->title}")
            ->greeting("Hello {$notifiable->name},")
            ->line("Your deposit for the deal on \"{$this->deal->listing->title}\" has been confirmed by the seller.")
            ->action('View Deal Details', url("/deals/{$this->deal->id}"))
            ->line("Next steps will follow shortly.");
    }
}
