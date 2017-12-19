<?php

namespace WouterDeSchuyter\Application\Commands\Users;

use WouterDeSchuyter\Domain\Commands\SignInUser;
use WouterDeSchuyter\Domain\Commands\SignOutUser;
use WouterDeSchuyter\Domain\Commands\Users\ActivateUser;
use WouterDeSchuyter\Domain\Users\InvalidUserCredentials;
use WouterDeSchuyter\Domain\Users\User;
use WouterDeSchuyter\Domain\Users\UserNotActivatedYet;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Domain\Users\UserSession;
use WouterDeSchuyter\Domain\Users\UserSessionRepository;
use WouterDeSchuyter\Infrastructure\ValueObjects\DateTime;

class ActivateUserHandler
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
     * @param ActivateUser $activateUser
     */
    public function handle(ActivateUser $activateUser)
    {
        $user = $this->userRepository->find($activateUser->getUserId());

        $user->setActivatedAt(new DateTime());

        $this->userRepository->update($user);
    }
}
