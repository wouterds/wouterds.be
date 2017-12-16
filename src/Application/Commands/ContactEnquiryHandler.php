<?php

namespace WouterDeSchuyter\Application\Commands;

use WouterDeSchuyter\Domain\Commands\ContactEnquiry;
use WouterDeSchuyter\Infrastructure\Mail\Mailer;
use WouterDeSchuyter\Infrastructure\Mail\Message\Factory as MessageFactory;
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
        $message = MessageFactory::startWithDefault()
            ->withSender(new Sender($contactEnquiry->getName(), $contactEnquiry->getEmail()))
            ->withSubject($contactEnquiry->getSubject())
            ->withBody($contactEnquiry->getMessage())
            ->build();

        $this->mailer->send($message);
    }
}
