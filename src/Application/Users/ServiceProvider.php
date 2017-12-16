<?php

namespace WouterDeSchuyter\Application\Users;

use League\Container\ServiceProvider\AbstractServiceProvider;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Domain\Users\UserRepository;

class ServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        UserRepository::class,
        AuthenticatedUser::class,
    ];

    /**
     * @inheritdoc
     */
    public function register()
    {
        $this->container->share(UserRepository::class, function () {
            return $this->container->get(DbalUserRepository::class);
        });

        $this->container->share(AuthenticatedUser::class, function () {
            return new AuthenticatedUser();
        });
    }
}
