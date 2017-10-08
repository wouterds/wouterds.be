<?php

namespace Wouterds\Infrastructure\Config;

use League\Container\ServiceProvider\AbstractServiceProvider;
use Predis\Client as RedisClient;

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
        // Get Redis client from container
        $redisClient = $this->container->get(RedisClient::class);

        // Version file
        $file = APP_DIR . '/.version';

        // File doesn't exist?
        if (!file_exists($file)) {
            return [
                'APP_VERSION_NUMBER' => 'unknown',
                'APP_VERSION_COMMIT' => 'unknown',
            ];
        }

        // Calculate file hash
        $fileHash = md5_file($file);
        $fileCacheKey = 'APP_VERSION.' . $fileHash;
        $version = $redisClient->get($fileCacheKey);

        // Found version in Redis?
        if (!empty($version)) {
            return json_decode($version, true);
        }

        // Get contents
        $version = file_get_contents($file);

        // Parse file
        $version = explode(PHP_EOL, $version);
        $versionNumber = $version[0];
        $versionCommit = $version[1];

        $version = [
            'APP_VERSION_NUMBER' => $versionNumber,
            'APP_VERSION_COMMIT' => $versionCommit,
        ];

        // Cache to redis
        $redisClient->set($fileCacheKey, json_encode($version));

        return $version;
    }
}
