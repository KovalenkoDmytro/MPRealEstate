<?php

namespace App\Notifications\MailBuilders;

use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;
use App\Notifications\Contracts\MailableContentBuilderInterface;


class SecurityDepositSetMailBuilder implements MailableContentBuilderInterface
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
            ->line("The seller has set a security deposit for your deal related to \"{$this->deal->listing->title}\".")
            ->line("💰 Security Deposit: \${$this->deal->security_deposit}")
            ->action('View Deal', url("/deals/{$this->deal->id}"))
            ->line("Please review and proceed with the next steps.");
    }
}
