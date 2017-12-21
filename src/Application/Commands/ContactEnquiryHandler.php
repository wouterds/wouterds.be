<?php

namespace WouterDeSchuyter\Application\Commands;

use WouterDeSchuyter\Domain\Commands\ContactEnquiry;
use WouterDeSchuyter\Infrastructure\Mail\Mailer;
use WouterDeSchuyter\Infrastructure\Mail\Message\MessageBuilder;
use WouterDeSchuyter\Infrastructure\Mail\Message\Participant;

class ContactEnquiryHandler
{
    /**
     * @var Mailer
     */
    private $mailer;

    /**
     * @param Mailer $mailer
     */
    public function __construct(Mailer $mailer)
    {
        $this->mailer = $mailer;
    }

    /**
     * @param ContactEnquiry $contactEnquiry
     */
    public function handle(ContactEnquiry $contactEnquiry)
    {
        $message = MessageBuilder::startWithDefault()
            ->withReplyTo(new Participant($contactEnquiry->getName(), $contactEnquiry->getEmail()))
            ->withSubject($contactEnquiry->getSubject())
            ->withBody($contactEnquiry->getMessage())
            ->build();

        $this->mailer->send($message);
    }
}
