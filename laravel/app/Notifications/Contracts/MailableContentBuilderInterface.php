<?php

namespace App\Notifications\Contracts;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Support\Arrayable;

interface MailableContentBuilderInterface
{
    public function build($notifiable): MailMessage;
}
