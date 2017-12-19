<?php

namespace WouterDeSchuyter\Application\Commands\Users;

use WouterDeSchuyter\Domain\Commands\Users\ActivateUser;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Infrastructure\Mail\Mailer;
use WouterDeSchuyter\Infrastructure\Mail\Message\Factory as MessageFactory;
use WouterDeSchuyter\Infrastructure\Mail\Message\Participant;
use WouterDeSchuyter\Infrastructure\ValueObjects\DateTime;

class ActivateUserHandler
{
    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @var Mailer
     */
    private $mailer;

    /**
     * @param UserRepository $userRepository
     * @param Mailer $mailer
     */
    public function __construct(UserRepository $userRepository, Mailer $mailer)
    {
        $this->userRepository = $userRepository;
        $this->mailer = $mailer;
    }

    /**
     * @param ActivateUser $activateUser
     */
    public function handle(ActivateUser $activateUser)
    {
        $user = $this->userRepository->find($activateUser->getUserId());

        $user->setActivatedAt(new DateTime());

        $this->userRepository->update($user);

        // Notify
        $message = 'Hi' . PHP_EOL;
        $message .= PHP_EOL;
        $message .= 'Your account has been reviewed and activated.' . PHP_EOL;
        $message .= PHP_EOL;
        $message .= 'Cheers';

        $message = MessageFactory::startWithDefault()
            ->withSubject('Account activated')
            ->withReceivers([new Participant($user->getName(), $user->getEmail())])
            ->withBody($message)
            ->build();

        $this->mailer->send($message);
    }
}
