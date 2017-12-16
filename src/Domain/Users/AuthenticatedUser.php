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
        // Not activated yet?
        if ($this->user && $this->user->getActivatedAt() === null) {
            return;
        }

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
