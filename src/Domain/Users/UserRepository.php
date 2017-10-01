<?php

namespace Wouterds\Domain\Users;

interface UserRepository
{
    /**
     * @param User $user
     * @return User
     */
    public function add(User $user);

    /**
     * @param int $id
     * @return User|null
     */
    public function find(int $id): ?User;
}
