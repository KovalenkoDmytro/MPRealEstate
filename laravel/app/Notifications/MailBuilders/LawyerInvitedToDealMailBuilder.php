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
            ->subject(__('mainBuilders.lawyerInvitedToDeal.subject', [
                'listingTitle' => $this->deal->listing->title,
            ]))
            ->greeting(__('mainBuilders.lawyerInvitedToDeal.greeting', [
                'name' => $notifiable->name,
            ]))
            ->line(__('mainBuilders.lawyerInvitedToDeal.lines.0'))
            ->line(__('mainBuilders.lawyerInvitedToDeal.lines.1', [
                'listingTitle' => $this->deal->listing->title,
            ]))
            ->action(
                __('mainBuilders.lawyerInvitedToDeal.action.label'),
                url(str_replace(':dealId', $this->deal->id, __('mainBuilders.lawyerInvitedToDeal.action.url')))
            )
            ->line(__('mainBuilders.lawyerInvitedToDeal.lines.2'));
    }
}
