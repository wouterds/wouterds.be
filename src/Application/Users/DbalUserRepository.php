<?php

namespace Wouterds\Application\Users;

use Doctrine\DBAL\Connection;
use Wouterds\Domain\Users\User;
use Wouterds\Domain\Users\UserRepository;

class DbalUserRepository implements UserRepository
{
    public const TABLE_NAME = 'user';

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
     * @param User $user
     * @return User
     */
    public function add(User $user)
    {
        $query = $this->connection->createQueryBuilder();
        $query->insert(self::TABLE_NAME);
        $query->values([
            'name' => $query->createNamedParameter($user->getName()),
            'email' => $query->createNamedParameter($user->getEmail()),
        ]);
        $query->execute();
    }

    /**
     * @param int $id
     * @return User|null
     */
    public function find(int $id): ?User
    {
        $query = $this->connection->createQueryBuilder();
        $query->select('*');
        $query->from(self::TABLE_NAME);
        $query->where('id = ' . $query->createNamedParameter($id));
        $result = $query->execute()->fetch();

        if (empty($result)) {
            return null;
        }

        return User::fromArray($result);
    }
}
