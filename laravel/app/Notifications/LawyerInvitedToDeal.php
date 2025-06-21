<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;
use App\Notifications\MailBuilders\LawyerInvitedToDealMailBuilder;

class LawyerInvitedToDeal extends Notification
{
    public Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new LawyerInvitedToDealMailBuilder($this->deal))->build($notifiable);
    }
}
