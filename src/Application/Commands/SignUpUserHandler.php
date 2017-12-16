<?php

namespace WouterDeSchuyter\Application\Commands;

use WouterDeSchuyter\Domain\Commands\SignUpUser;
use WouterDeSchuyter\Domain\Users\InvalidUserCredentials;
use WouterDeSchuyter\Domain\Users\User;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Domain\Users\UserSession;

class SignUpUserHandler
{
    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @param SignUpUser $signInUser
     */
    public function handle(SignUpUser $signInUser)
    {
        $user = new User($signInUser->getEmail(), $signInUser->getPassword());
        $user->setName($signInUser->getName());
        $this->userRepository->add($user);
    }
}
