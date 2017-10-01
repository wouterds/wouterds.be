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
    public function add(User $user): User
    {
        $salt = hash('sha256', microtime(true) . $user->getEmail());
        $password = self::hashPassword($salt, $user->getPassword());

        $query = $this->connection->createQueryBuilder();
        $query->insert(self::TABLE_NAME);
        $query->values([
            'name' => $query->createNamedParameter($user->getName()),
            'email' => $query->createNamedParameter($user->getEmail()),
            'salt' => $query->createNamedParameter($salt),
            'password' => $query->createNamedParameter($password),
        ]);
        $query->execute();

        return $this->find($this->connection->lastInsertId());
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

    /**
     * @param string $salt
     * @param string $input
     * @return string
     */
    public static function hashPassword(string $salt, string $input): string
    {
        $password = $input;
        for ($i = 0; $i < 10000; $i++) {
            $password = hash('256', $salt . $password . $salt);
        }

        return $password;
    }
}
