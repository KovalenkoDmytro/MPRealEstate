<?php

namespace App\Notifications\MailBuilders;

use App\Models\RealEstateListing;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Contracts\MailableContentBuilderInterface;

class OfferStatusUpdatedMailBuilder implements MailableContentBuilderInterface
{
    protected RealEstateListing $listing;
    protected string $status;

    public function __construct(RealEstateListing $listing, string $status)
    {
        $this->listing = $listing;
        $this->status = $status;
    }

    public function build($notifiable): MailMessage
    {


        if ($this->status === 'accepted') {
            return (new MailMessage)
                ->greeting("Congratulations {$notifiable->name}!")
                ->line("🎉 Your offer for \"{$this->listing->title}\" has been accepted.")
                ->line("Our team has created a deal and the process has started.")
                ->action('View Your Deal', url("/deals"))
                ->line("Thank you for using our platform!");
        }

        if ($this->status === 'rejected') {
            return (new MailMessage)
                ->greeting("Hello {$notifiable->name},")
                ->line("Unfortunately, your offer for \"{$this->listing->title}\" has been rejected.")
                ->line("We encourage you to explore other available listings.")
                ->action('Browse Listings', url("/listings"))
                ->line("Thank you for your interest.");
        }

        return (new MailMessage)
            ->greeting("Hello {$notifiable->name},")
            ->line("Your offer status on \"{$this->listing->title}\" has been updated.");
    }
}
