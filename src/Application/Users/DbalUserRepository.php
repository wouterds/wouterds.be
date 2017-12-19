<?php

namespace WouterDeSchuyter\Application\Users;

use Doctrine\DBAL\Connection;
use WouterDeSchuyter\Domain\Users\User;
use WouterDeSchuyter\Domain\Users\UserId;
use WouterDeSchuyter\Domain\Users\UserRepository;

class DbalUserRepository implements UserRepository
{
    public const TABLE = 'user';

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
     */
    public function add(User $user)
    {
        $this->connection->insert(self::TABLE, [
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'salt' => $user->getSalt(),
            'password' => $user->getPassword(),
        ]);
    }

    /**
     * @return User[]
     */
    public function findAll(): array
    {
        $query = $this->connection->createQueryBuilder();
        $query->select('*');
        $query->from(self::TABLE);
        $query->where('deleted_at IS NULL');
        $rows = $query->execute()->fetchAll();

        if (empty($rows)) {
            return [];
        }

        return array_map(function ($row) {
            return User::fromArray($row);
        }, $rows);
    }

    /**
     * @param UserId $id
     * @return null|User
     */
    public function find(UserId $id): ?User
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

        return User::fromArray($result);
    }

    /**
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User
    {
        $query = $this->connection->createQueryBuilder();
        $query->select('*');
        $query->from(self::TABLE);
        $query->where('email = ' . $query->createNamedParameter($email));
        $query->andWhere('deleted_at IS NULL');
        $result = $query->execute()->fetch();

        if (empty($result)) {
            return null;
        }

        return User::fromArray($result);
    }

    /**
     * @param User $user
     */
    public function update(User $user)
    {
        $query = $this->connection->createQueryBuilder();
        $query->update(self::TABLE);
        $query->set('name', $query->createNamedParameter($user->getName()));
        $query->set('email', $query->createNamedParameter($user->getEmail()));
        $query->set('password', $query->createNamedParameter($user->getPassword()));
        $query->set('salt', $query->createNamedParameter($user->getSalt()));
        $query->set('activated_at', $query->createNamedParameter($user->getActivatedAt()));
        $query->set('updated_at', 'NOW()');
        $query->where('id = ' . $query->createNamedParameter($user->getId()));
        $query->execute();
    }

    /**
     * @param UserId $id
     */
    public function delete(UserId $id)
    {
        $query = $this->connection->createQueryBuilder();
        $query->update(self::TABLE);
        $query->set('updated_at', 'NOW()');
        $query->set('deleted_at', 'NOW()');
        $query->where('id = ' . $query->createNamedParameter($id));
        $query->execute();
    }
}
