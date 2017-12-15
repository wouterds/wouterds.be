<?php

namespace WouterDeSchuyter\Infrastructure\Mail;

use Swift_Mailer;
use Swift_SmtpTransport;

class SparkPostMailer implements Mailer
{
    /**
     * @var Swift_Mailer
     */
    private $swiftMailer;

    /**
     * @param string $apiKey
     */
    public function __construct(string $apiKey)
    {
        $transport = new Swift_SmtpTransport('smtp.sparkpostmail.com', 587, 'tls');
        $transport->setUsername('SMTP_Injection');
        $transport->setPassword($apiKey);

        $this->swiftMailer = new Swift_Mailer($transport);
    }
}
