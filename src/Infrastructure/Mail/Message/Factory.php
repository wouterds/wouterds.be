<?php

namespace WouterDeSchuyter\Infrastructure\Mail\Message;

class Factory
{
    /**
     * @var Sender
     */
    private $sender;

    /**
     * @var Receiver[]
     */
    private $receivers;

    /**
     * @var string
     */
    private $subject;

    /**
     * @var string
     */
    private $body;

    /**
     * @return Factory
     */
    public static function startWithDefault()
    {
        $factory = new self();
        $factory->sender = new Sender(getenv('MAIL_MESSAGE_SENDER_NAME'), getenv('MAIL_MESSAGE_SENDER_EMAIL'));
        $factory->receivers = [new Receiver(getenv('MAIL_MESSAGE_RECEIVER_NAME'), getenv('MAIL_MESSAGE_RECEIVER_EMAIL'))];

        return $factory;
    }

    /**
     * @param Sender $sender
     * @return Factory
     */
    public function withSender(Sender $sender)
    {
        $this->sender = $sender;

        return $this;
    }

    /**
     * @param array $receivers
     * @return Factory
     */
    public function withReceivers(array $receivers)
    {
        $this->receivers = $receivers;

        return $this;
    }

    /**
     * @param string $subject
     * @return Factory
     */
    public function withSubject(string $subject)
    {
        $this->subject = $subject;

        return $this;
    }

    /**
     * @param string $message
     * @return Factory
     */
    public function withBody(string $message)
    {
        $this->body = $message;

        return $this;
    }

    /**
     * @return Message
     */
    public function build()
    {
        return new Message(
            $this->sender,
            $this->receivers,
            $this->subject,
            $this->body
        );
    }
}
