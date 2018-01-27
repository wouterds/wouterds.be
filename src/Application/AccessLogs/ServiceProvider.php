<?php

namespace WouterDeSchuyter\Application\AccessLogs;

use League\Container\ServiceProvider\AbstractServiceProvider;
use WouterDeSchuyter\Domain\AccessLogs\AccessLogRepository;

class ServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        AccessLogRepository::class,
    ];

    /**
     * @inheritdoc
     */
    public function register()
    {
        $this->container->share(AccessLogRepository::class, function () {
            return $this->container->get(DbalAccessLogRepository::class);
        });
    }
}
