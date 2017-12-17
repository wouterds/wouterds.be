<?php

namespace WouterDeSchuyter\Application\Commands;

use WouterDeSchuyter\Domain\Commands\SignUpUser;
use WouterDeSchuyter\Domain\Users\User;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Infrastructure\Mail\Mailer;
use WouterDeSchuyter\Infrastructure\Mail\Message\Factory as MessageFactory;
use WouterDeSchuyter\Infrastructure\Mail\Message\Participant;

class SignUpUserHandler
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
     * @param SignUpUser $signInUser
     */
    public function handle(SignUpUser $signInUser)
    {
        $user = new User($signInUser->getEmail(), $signInUser->getPassword());
        $user->setName($signInUser->getName());
        $this->userRepository->add($user);

        // Email administrator
        $message = 'Hi' . PHP_EOL;
        $message .= PHP_EOL;
        $message .= 'A new user has registered and needs to be activated.' . PHP_EOL;
        $message .= PHP_EOL;
        $message .= 'Name: ' . $user->getName() . PHP_EOL;
        $message .= 'Email: ' . $user->getEmail() . PHP_EOL;
        $message .= PHP_EOL;
        $message .= 'Cheers';

        $message = MessageFactory::startWithDefault()
            ->withSubject('New registration')
            ->withBody($message)
            ->build();

        $this->mailer->send($message);

        // Email user
        $message = 'Hi' . PHP_EOL;
        $message .= PHP_EOL;
        $message .= 'You have successfully registered.' . PHP_EOL;
        $message .= 'Once your account has been reviewed and activated you will be able to sign in.' . PHP_EOL;
        $message .= PHP_EOL;
        $message .= 'Cheers';

        $message = MessageFactory::startWithDefault()
            ->withSubject('Successfully registered')
            ->withBody($message)
            ->withReceivers([new Participant($user->getName(), $user->getEmail())])
            ->build();

        $this->mailer->send($message);
    }
}
