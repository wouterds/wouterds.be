<?php

namespace WouterDeSchuyter\Infrastructure\Youtube;

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
            return new Api(getenv('YOUTUBE_API_KEY'));
        });
    }
}
