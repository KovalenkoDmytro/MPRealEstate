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
                ->subject(__('mainBuilders.dealBreakRequested.sender.subject'))
                ->greeting(__('mainBuilders.dealBreakRequested.sender.greeting', [
                    'name' => $notifiable->name,
                ]))
                ->line(__('mainBuilders.dealBreakRequested.sender.lines.0', [
                    'deal' => $this->deal->name,
                ]))
                ->action(
                    __('mainBuilders.dealBreakRequested.sender.action.label'),
                    url(str_replace(':dealId', $this->deal->id, __('mainBuilders.dealBreakRequested.sender.action.url')))
                )
                ->line(__('mainBuilders.dealBreakRequested.sender.lines.1'));
        }

        // Receiver: action required message
        return (new MailMessage)
            ->subject(__('mainBuilders.dealBreakRequested.receiver.subject'))
            ->greeting(__('mainBuilders.dealBreakRequested.receiver.greeting', [
                'name' => $notifiable->name,
            ]))
            ->line(__('mainBuilders.dealBreakRequested.receiver.lines.0', [
                'deal' => $this->deal->name,
            ]))
            ->action(
                __('mainBuilders.dealBreakRequested.receiver.action.label'),
                url(str_replace(':dealId', $this->deal->id, __('mainBuilders.dealBreakRequested.receiver.action.url')))
            )
            ->line(__('mainBuilders.dealBreakRequested.receiver.lines.1'));
    }
}
