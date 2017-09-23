<?php

namespace Wouterds\Infrastructure\Database;

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
            return DriverManager::getConnection([
                'dbname' => getenv('MYSQL_DATABASE'),
                'user' => getenv('MYSQL_USER'),
                'password' => getenv('MYSQL_PASSWORD'),
                'host' => getenv('MYSQL_HOST'),
                'driver' => 'pdo_mysql',
                'charset' => 'utf8mb4',
                'collate' => 'utf8mb4_unicode_ci',
            ]);
        });
    }
}
