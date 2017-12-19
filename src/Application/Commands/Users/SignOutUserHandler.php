<?php

namespace WouterDeSchuyter\Application\Commands\Users;

use WouterDeSchuyter\Domain\Commands\SignOutUser;
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
