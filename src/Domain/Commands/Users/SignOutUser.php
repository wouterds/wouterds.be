<?php

namespace WouterDeSchuyter\Domain\Commands\Users;

use WouterDeSchuyter\Domain\Users\UserSessionId;

class SignOutUser
{
    /**
     * @var UserSessionId
     */
    private $userSessionId;

    /**
     * @param UserSessionId $userSessionId
     */
    public function __construct(UserSessionId $userSessionId)
    {
        $this->userSessionId = $userSessionId;
    }

    /**
     * @return UserSessionId
     */
    public function getUserSessionId(): UserSessionId
    {
        return $this->userSessionId;
    }
}
