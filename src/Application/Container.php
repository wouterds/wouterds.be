<?php

namespace Wouterds\Application;

use League\Container\Container as LeagueContainer;
use League\Container\ReflectionContainer;

use Wouterds\Application\Http\ServiceProvider as HttpServiceProvider;

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

        return $container;
    }
}
