<?php

namespace Wouterds\Domain\Users;

interface UserRepository
{
    /**
     * @param User $user
     */
    public function add(User $user);
}
