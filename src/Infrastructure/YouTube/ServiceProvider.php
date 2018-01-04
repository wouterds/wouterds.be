<?php

namespace WouterDeSchuyter\Infrastructure\YouTube;

use League\Container\ServiceProvider\AbstractServiceProvider;

class ServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        Api::class,
    ];

    /**
     * @inheritdoc
     */
    public function register()
    {
        $this->container->share(Api::class, function () {
            return new Api(getenv('YT_API_KEY'));
        });
    }
}
