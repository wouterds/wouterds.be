<?php

namespace WouterDeSchuyter\Domain\Users;

use JsonSerializable;

class UserSession implements JsonSerializable
{
    /**
     * @var UserSessionId
     */
    private $id;

    /**
     * @var UserId
     */
    private $userId;

    /**
     * @param UserId $userId
     */
    public function __construct(UserId $userId)
    {
        $this->id = new UserSessionId();
        $this->userId = $userId;
    }

    /**
     * @param array $data
     * @return UserSession
     */
    public static function fromArray(array $data): UserSession
    {
        $user = new UserSession(new UserId($data['user_id']));
        $user->id = new UserSessionId(!empty($data['id']) ? $data['id'] : null);

        return $user;
    }

    /**
     * @return UserSessionId
     */
    public function getId(): UserSessionId
    {
        return $this->id;
    }

    /**
     * @return UserId
     */
    public function getUserId(): UserId
    {
        return $this->userId;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return get_object_vars($this);
    }
}
