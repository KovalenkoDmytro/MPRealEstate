<?php

namespace App\Notifications\Contracts;

use Illuminate\Notifications\Messages\MailMessage;

interface MailableContentBuilderInterface
{
    public function build($notifiable): MailMessage;
}
