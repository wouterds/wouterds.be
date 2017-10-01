<?php

namespace Wouterds\Application\Users;

use League\Container\ServiceProvider\AbstractServiceProvider;
use Wouterds\Domain\Users\UserRepository;

class ServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        UserRepository::class,
    ];

    /**
     * @inheritdoc
     */
    public function register()
    {
        $this->container->share(UserRepository::class, function() {
            return $this->container->get(DbalUserRepository::class);
        });
    }
}
