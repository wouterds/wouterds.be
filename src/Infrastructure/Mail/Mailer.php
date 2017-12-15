<?php

namespace WouterDeSchuyter\Infrastructure\Mail;

use WouterDeSchuyter\Infrastructure\Mail\Message\Message;

interface Mailer
{
    /**
     * @param Message $mail
     * @return bool
     */
    public function send(Message $mail): bool;
}
