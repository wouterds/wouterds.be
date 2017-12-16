<?php

namespace WouterDeSchuyter\Infrastructure\Mail\Message;

class Message
{
    /**
     * @var Participant
     */
    private $sender;

    /**
     * @var Participant
     */
    private $replyTo;

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
     * @param Participant $replyTo
     * @param array $recipients
     * @param string $subject
     * @param string $message
     */
    public function __construct(
        Participant $sender,
        Participant $replyTo,
        array $recipients,
        string $subject,
        string $message
    ) {
        $this->sender = $sender;
        $this->replyTo = $replyTo;
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
     * @return Participant
     */
    public function getReplyTo(): Participant
    {
        return $this->replyTo;
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
