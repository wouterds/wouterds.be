<?php

namespace Wouterds\Application;

use League\Container\Container as LeagueContainer;
use League\Container\ReflectionContainer;

use Wouterds\Application\Http\ServiceProvider as HttpServiceProvider;
use Wouterds\Application\Users\ServiceProvider as UserServiceProvider;
use Wouterds\Infrastructure\Config\ServiceProvider as ConfigServiceProvider;
use Wouterds\Infrastructure\Database\ServiceProvider as DatabaseServiceProvider;
use Wouterds\Infrastructure\View\ServiceProvider as ViewServiceProvider;

class Container extends LeagueContainer
{
    /**
     * Initialize container
     *
     * @return Container
     */
    public static function load()
    {
        $container = new static();
        $container->delegate(new ReflectionContainer());

        $container->addServiceProvider(HttpServiceProvider::class);
        $container->addServiceProvider(ConfigServiceProvider::class);
        $container->addServiceProvider(DatabaseServiceProvider::class);
        $container->addServiceProvider(ViewServiceProvider::class);
        $container->addServiceProvider(UserServiceProvider::class);

        return $container;
    }
}
