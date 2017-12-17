<?php

namespace WouterDeSchuyter\Infrastructure\Mail;

use WouterDeSchuyter\Infrastructure\Mail\Message\Message;

interface Mailer
{
    /**
     * @param Message $message
     * @return bool
     */
    public function send(Message $message): bool;
}
