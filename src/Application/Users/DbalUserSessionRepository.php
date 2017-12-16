<?php

namespace WouterDeSchuyter\Application\Users;

use Doctrine\DBAL\Connection;
use WouterDeSchuyter\Domain\Users\UserSession;
use WouterDeSchuyter\Domain\Users\UserSessionId;
use WouterDeSchuyter\Domain\Users\UserSessionRepository;

class DbalUserSessionRepository implements UserSessionRepository
{
    public const TABLE = 'user_session';

    /**
     * @var Connection
     */
    private $connection;

    /**
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    /**
     * @param UserSession $userSession
     */
    public function add(UserSession $userSession)
    {
        $this->connection->insert(self::TABLE, [
            'id' => $userSession->getId(),
            'user_id' => $userSession->getUserId(),
        ]);
    }

    /**
     * @param UserSessionId $id
     * @return UserSession|null
     */
    public function find(UserSessionId $id): ?UserSession
    {
        // TODO: Implement find() method.
    }
}
