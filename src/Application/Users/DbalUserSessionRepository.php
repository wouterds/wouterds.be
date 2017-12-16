<?php

namespace WouterDeSchuyter\Application\Users;

use Doctrine\DBAL\Connection;
use WouterDeSchuyter\Domain\Users\UserId;
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
        $query = $this->connection->createQueryBuilder();
        $query->select('*');
        $query->from(self::TABLE);
        $query->where('id = ' . $query->createNamedParameter($id));
        $query->andWhere('deleted_at IS NULL');
        $result = $query->execute()->fetch();

        if (empty($result)) {
            return null;
        }

        return UserSession::fromArray($result);
    }

    /**
     * @param UserId $userId
     */
    public function deleteByUserId(UserId $userId)
    {
        $query = $this->connection->createQueryBuilder();
        $query->update(self::TABLE);
        $query->set('updated_at', 'NOW()');
        $query->set('deleted_at', 'NOW()');
        $query->where('user_id = ' . $query->createNamedParameter($userId));
        $query->andWhere('deleted_at IS NULL');
        $query->execute();
    }
}
