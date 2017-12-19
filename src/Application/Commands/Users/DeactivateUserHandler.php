<?php

namespace WouterDeSchuyter\Application\Commands\Users;

use WouterDeSchuyter\Domain\Commands\Users\DeactivateUser;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Infrastructure\Mail\Mailer;
use WouterDeSchuyter\Infrastructure\Mail\Message\Factory as MessageFactory;
use WouterDeSchuyter\Infrastructure\Mail\Message\Participant;

class DeactivateUserHandler
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
     * @param DeactivateUser $deactivateUser
     */
    public function handle(DeactivateUser $deactivateUser)
    {
        $user = $this->userRepository->find($deactivateUser->getUserId());

        $user->setActivatedAt(null);

        $this->userRepository->update($user);

        // Notify
        $message = 'Hi' . PHP_EOL;
        $message .= PHP_EOL;
        $message .= 'Your account has been deactivated.' . PHP_EOL;
        $message .= PHP_EOL;
        $message .= 'Cheers';

        $message = MessageFactory::startWithDefault()
            ->withSubject('Account deactivated')
            ->withReceivers([new Participant($user->getName(), $user->getEmail())])
            ->withBody($message)
            ->build();

        $this->mailer->send($message);
    }
}
