<?php

namespace WouterDeSchuyter\Infrastructure\Vimeo;

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
            return new Api(getenv('API_KEY_VIMEO'));
        });
    }
}
