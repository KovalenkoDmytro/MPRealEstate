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
            ->subject(__('mainBuilders.securityDepositSet.subject'))
            ->greeting(__('mainBuilders.securityDepositSet.greeting', [
                'name' => $notifiable->name,
            ]))
            ->line(__('mainBuilders.securityDepositSet.lines.0', [
                'listingTitle' => $this->deal->listing->title,
            ]))
            ->line(__('mainBuilders.securityDepositSet.lines.1', [
                'securityDeposit' => number_format($this->deal->security_deposit, 2),
            ]))
            ->action(
                __('mainBuilders.securityDepositSet.action.label'),
                url(str_replace(':dealId', $this->deal->id, __('mainBuilders.securityDepositSet.action.url')))
            )
            ->line(__('mainBuilders.securityDepositSet.lines.2'));
    }
}
