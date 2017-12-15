<?php

namespace WouterDeSchuyter\Infrastructure\Database;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\DriverManager;
use League\Container\ServiceProvider\AbstractServiceProvider;

class ServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        Connection::class,
    ];

    /**
     * {@inheritdoc}
     */
    public function register()
    {
        $this->container->share(Connection::class, function () {
            $dbName = getenv('MYSQL_DATABASE');
            $user = getenv('MYSQL_USER');
            $password = getenv('MYSQL_PASSWORD');
            $host = getenv('MYSQL_HOST');
            $driver = 'pdo_mysql';
            $charset = 'utf8mb4';
            $collate = 'utf8mb4_unicode_ci';

            if (defined('PHPUNIT')) {
                $dbName = getenv('MYSQL_TEST_DATABASE');
            }

            return DriverManager::getConnection([
                'dbname' => $dbName,
                'user' => $user,
                'password' => $password,
                'host' => $host,
                'driver' => $driver,
                'charset' => $charset,
                'collate' => $collate,
            ]);
        });
    }
}
