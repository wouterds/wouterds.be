<?php

namespace Wouterds\Domain\Users;

interface UserRepository
{
    /**
     * @param User $user
     */
    public function add(User $user);

    /**
     * @param int $id
     * @return User
     */
    public function find(int $id): ?User;
}
