<?php

namespace WouterDeSchuyter\Infrastructure\Mail\Message;

class Message
{
    /**
     * @var Participant
     */
    private $sender;

    /**
     * @var Participant[]
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
     * @param Participant $sender
     * @param array $recipients
     * @param string $subject
     * @param string $message
     */
    public function __construct(
        Participant $sender,
        array $recipients,
        string $subject,
        string $message
    ) {
        $this->sender = $sender;
        $this->recipients = $recipients;
        $this->subject = $subject;
        $this->body = $message;
    }

    /**
     * @return Participant
     */
    public function getSender(): Participant
    {
        return $this->sender;
    }

    /**
     * @return Participant[]
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
