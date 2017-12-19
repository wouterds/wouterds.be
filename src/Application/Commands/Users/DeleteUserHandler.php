<?php

namespace WouterDeSchuyter\Application\Commands\Users;

use WouterDeSchuyter\Domain\Commands\Users\DeleteUser;
use WouterDeSchuyter\Domain\Users\UserRepository;

class DeleteUserHandler
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
     * @param DeleteUser $deleteUser
     */
    public function handle(DeleteUser $deleteUser)
    {
        $this->userRepository->delete($deleteUser->getUserId());
    }
}
