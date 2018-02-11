<?php

namespace WouterDeSchuyter\Infrastructure\ImageManager;

use Intervention\Image\ImageManager;
use League\Container\ServiceProvider\AbstractServiceProvider;

class ServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        ImageManager::class,
    ];

    /**
     * {@inheritdoc}
     */
    public function register()
    {
        $this->container->share(ImageManager::class, function () {
            return new ImageManager(['driver' => 'gd']);
        });
    }
}
