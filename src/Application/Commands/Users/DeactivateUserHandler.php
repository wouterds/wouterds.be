<?php

namespace WouterDeSchuyter\Application\Commands\Users;

use WouterDeSchuyter\Domain\Commands\Users\DeactivateUser;
use WouterDeSchuyter\Domain\Users\UserRepository;

class DeactivateUserHandler
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
     * @param DeactivateUser $deactivateUser
     */
    public function handle(DeactivateUser $deactivateUser)
    {
        $user = $this->userRepository->find($deactivateUser->getUserId());

        $user->setActivatedAt(null);

        $this->userRepository->update($user);
    }
}
