<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;
use App\Notifications\MailBuilders\LawyerInvitedToDealMailBuilder;
use Illuminate\Contracts\Queue\ShouldQueue;


class LawyerInvitedToDeal extends Notification implements ShouldQueue
{
    public Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new LawyerInvitedToDealMailBuilder($this->deal))->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'     => 'lawyer_invited_to_deal',
            'title'    => '--Lawyer Invited to Deal',
            'body'     => "--You were invited to Deal #{$this->deal->name}.",
            'url'      => route('deals.show', $this->deal), // adjust if your route differs
        ];
    }
}
