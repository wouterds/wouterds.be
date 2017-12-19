<?php

namespace WouterDeSchuyter\Application\Commands;

use WouterDeSchuyter\Domain\Commands\SignInUser;
use WouterDeSchuyter\Domain\Commands\SignOutUser;
use WouterDeSchuyter\Domain\Users\InvalidUserCredentials;
use WouterDeSchuyter\Domain\Users\User;
use WouterDeSchuyter\Domain\Users\UserNotActivatedYet;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Domain\Users\UserSession;
use WouterDeSchuyter\Domain\Users\UserSessionRepository;

class SignOutUserHandler
{
    /**
     * @var UserSessionRepository
     */
    private $userSessionRepository;

    /**
     * @param UserSessionRepository $userSessionRepository
     */
    public function __construct(UserSessionRepository $userSessionRepository)
    {
        $this->userSessionRepository = $userSessionRepository;
    }

    public function handle(SignOutUser $signOutUser)
    {
        $this->userSessionRepository->delete($signOutUser->getUserSessionId());

        setcookie('user_session_id', $signOutUser->getUserSessionId(), -1, '/');
    }
}
