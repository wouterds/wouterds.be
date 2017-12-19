<?php

namespace WouterDeSchuyter\Application\Commands\Users;

use WouterDeSchuyter\Domain\Commands\Users\ActivateUser;
use WouterDeSchuyter\Domain\Users\UserRepository;
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
