<?php

namespace WouterDeSchuyter\Application\Commands;

use WouterDeSchuyter\Domain\Commands\SignInUser;
use WouterDeSchuyter\Domain\Users\InvalidUserCredentials;
use WouterDeSchuyter\Domain\Users\User;
use WouterDeSchuyter\Domain\Users\UserNotActivatedYet;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Domain\Users\UserSession;
use WouterDeSchuyter\Domain\Users\UserSessionRepository;

class SignInUserHandler
{
    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @var UserSessionRepository
     */
    private $userSessionRepository;

    /**
     * @param UserRepository $userRepository
     * @param UserSessionRepository $userSessionRepository
     */
    public function __construct(UserRepository $userRepository, UserSessionRepository $userSessionRepository)
    {
        $this->userSessionRepository = $userSessionRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * @param SignInUser $signInUser
     * @throws InvalidUserCredentials
     * @throws UserNotActivatedYet
     */
    public function handle(SignInUser $signInUser)
    {
        $user = $this->userRepository->findByEmail($signInUser->getEmail());

        // No user found?
        if (empty($user)) {
            throw new InvalidUserCredentials();
        }

        // Invalid password?
        if (User::hashPassword($user->getSalt(), $signInUser->getPassword()) !== $user->getPassword()) {
            throw new InvalidUserCredentials();
        }

        // Activated already?
        if (empty($user->getActivatedAt())) {
            throw new UserNotActivatedYet();
        }

        // Delete old sessions, allow only 1 client to be signed in at the time
        $this->userSessionRepository->deleteByUserId($user->getId());

        // New user session
        $userSession = new UserSession($user->getId());
        $this->userSessionRepository->add($userSession);

        setcookie('user_session_id', $userSession->getId(), time() + strtotime('1 month'), '/');
    }
}
