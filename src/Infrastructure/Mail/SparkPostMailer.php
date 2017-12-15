<?php

namespace WouterDeSchuyter\Infrastructure\Mail;

use Exception;
use Swift_Mailer;
use Swift_Message;
use Swift_SmtpTransport;
use WouterDeSchuyter\Infrastructure\Mail\Message\Message;

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

    /**
     * @param Message $message
     * @return bool
     */
    public function send(Message $message): bool
    {
        try {
            $receivers = [];
            foreach ($message->getRecipients() as $receiver) {
                $receivers[$receiver->getEmail()] = $receiver->getName();
            }

            $swiftMessage = new Swift_Message();
            $swiftMessage->setFrom([$message->getSender()->getEmail() => $message->getSender()->getName()]);
            $swiftMessage->setTo($receivers);
            $swiftMessage->setSubject($message->getSubject());
            $swiftMessage->setReplyTo([$message->getSender()->getEmail() => $message->getSender()->getName()]);
            $swiftMessage->setBody($message->getBody());

            return $this->swiftMailer->send($swiftMessage) > 0;
        } catch (Exception $e) {
            // TODO: log
        }

        return false;
    }
}
