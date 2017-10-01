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
            $defaults = $_ENV;

            // Load version
            $version = $this->loadVersion();

            return new Config(array_merge(
                $defaults,
                $version
            ));
        });
    }

    /**
     * @return array
     */
    private function loadVersion(): array
    {
        $file = APP_DIR . '/.version';
        $version = file_get_contents($file);
        $version = explode(PHP_EOL, $version);

        return [
            'APP_VERSION_NUMBER' => $version[0],
            'APP_VERSION_COMMIT' => $version[1],
        ];
    }
}
