<?php

namespace Wouterds\Infrastructure\Config;

use League\Container\ServiceProvider\AbstractServiceProvider;

class ServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        Config::class,
    ];

    /**
     * {@inheritdoc}
     */
    public function register()
    {
        $this->container->share(Config::class, function () {
            // Defaults
            $settings = $_ENV;

            // Load version
            $version = file_get_contents(APP_DIR . '/.version');
            $version = explode(PHP_EOL, $version);
            $settings['APP_VERSION_NUMBER'] = $version[0];
            $settings['APP_VERSION_COMMIT'] = $version[1];

            return new Config($settings);
        });
    }
}
