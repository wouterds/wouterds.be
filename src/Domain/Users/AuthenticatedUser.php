<?php

namespace WouterDeSchuyter\Domain\Users;

class AuthenticatedUser
{
    /**
     * @var User
     */
    private $user;

    /**
     * @return User|null
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    /**
     * @return bool
     */
    public function isLoggedIn(): bool
    {
        return !empty($this->user);
    }
}
