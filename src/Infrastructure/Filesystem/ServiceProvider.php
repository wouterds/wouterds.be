<?php

namespace WouterDeSchuyter\Infrastructure\Filesystem;

use Emgag\Flysystem\Hash\HashPlugin;
use League\Container\ServiceProvider\AbstractServiceProvider;
use League\Flysystem\Adapter\Local as LocalAdapter;
use League\Flysystem\Filesystem;

class ServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        Filesystem::class,
    ];

    /**
     * @inheritdoc
     */
    public function register()
    {
        $this->container->share(Filesystem::class, function () {
            $localAdapter = new LocalAdapter(APP_DIR . getenv('FILESYSTEM_DIR'));

            $filesystem = new Filesystem($localAdapter);
            $filesystem->addPlugin(new HashPlugin());

            return $filesystem;
        });
    }
}
