<?php

namespace App\Notifications\MailBuilders;

use App\Models\Deal;
use App\Notifications\Contracts\MailableContentBuilderInterface;
use Illuminate\Notifications\Messages\MailMessage;

class DealBreakRequestedMailBuilder implements MailableContentBuilderInterface
{
    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function build($notifiable): MailMessage
    {
        $initiatorId = $this->deal->breakRequest->initiator_id ?? null;

        if ($notifiable->id === $initiatorId) {
            // Sender: confirmation message
            return (new MailMessage)
                ->subject('Break Request Sent')
                ->greeting('Hello ' . $notifiable->name)
                ->line("You have successfully requested to break the deal: {$this->deal->name}.")
                ->action('View Deal', url("/deals/{$this->deal->id}"))
                ->line('We have notified the other party. You will be informed once they respond.');
        }

        // Receiver: action required message
        return (new MailMessage)
            ->subject('Deal Break Request')
            ->greeting('Hello ' . $notifiable->name)
            ->line("A request has been made to break the deal: {$this->deal->name}.")
            ->action('Review Deal', url("/deals/{$this->deal->id}"))
            ->line('Please review and respond to the break request.');
    }
}
