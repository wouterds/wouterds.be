<?php

namespace WouterDeSchuyter\Infrastructure\Mail\Message;

class Message
{
    /**
     * @var Sender
     */
    private $sender;

    /**
     * @var Receiver[]
     */
    private $recipients;

    /**
     * @var string
     */
    private $subject;

    /**
     * @var string
     */
    private $body;

    /**
     * @param Sender $sender
     * @param array $recipients
     * @param string $subject
     * @param string $message
     */
    public function __construct(Sender $sender, array $recipients, string $subject, string $message)
    {
        $this->sender = $sender;
        $this->recipients = $recipients;
        $this->subject = $subject;
        $this->body = $message;
    }

    /**
     * @return Sender
     */
    public function getSender(): Sender
    {
        return $this->sender;
    }

    /**
     * @return Receiver[]
     */
    public function getRecipients(): array
    {
        return $this->recipients;
    }

    /**
     * @return string
     */
    public function getSubject(): string
    {
        return $this->subject;
    }

    /**
     * @return string
     */
    public function getBody(): string
    {
        return $this->body;
    }
}
