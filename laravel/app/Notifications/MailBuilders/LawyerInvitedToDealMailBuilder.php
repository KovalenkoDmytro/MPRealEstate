<?php

namespace App\Notifications\MailBuilders;

use App\Models\Deal;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Contracts\MailableContentBuilderInterface;

class LawyerInvitedToDealMailBuilder implements MailableContentBuilderInterface
{
    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function build($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("You’ve Been Invited to a Deal: {$this->deal->listing->title}")
            ->greeting("Hello {$notifiable->name},")
            ->line("You have been invited to participate in a real estate deal.")
            ->line("🏡 Property: {$this->deal->listing->title}")
            ->action('View Deal', url("/deals/{$this->deal->id}"))
            ->line('Please review the deal and take action where needed.');
    }
}
