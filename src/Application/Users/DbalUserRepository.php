<?php

namespace Wouterds\Application\Users;

use Doctrine\DBAL\Connection;
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
}
