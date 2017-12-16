<?php

namespace WouterDeSchuyter\Domain\Users;

interface UserSessionRepository
{
    /**
     * @param UserSession $userSession
     */
    public function add(UserSession $userSession);

    /**
     * @param UserSessionId $id
     * @return UserSession|null
     */
    public function find(UserSessionId $id): ?UserSession;

    /**
     * @param UserId $userId
     */
    public function deleteByUserId(UserId $userId);
}
