<?php

namespace WouterDeSchuyter\Domain\Commands\Users;

use WouterDeSchuyter\Domain\Users\UserId;

class ActivateUser
{
    /**
     * @var UserId
     */
    private $userId;

    /**
     * @param UserId $userId
     */
    public function __construct(UserId $userId)
    {
        $this->userId = $userId;
    }

    /**
     * @return UserId
     */
    public function getUserId(): UserId
    {
        return $this->userId;
    }
}
