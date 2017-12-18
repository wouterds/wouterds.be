<?php

namespace WouterDeSchuyter\Application\Media;

use League\Container\ServiceProvider\AbstractServiceProvider;
use WouterDeSchuyter\Domain\Media\MediaRepository;

class ServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        MediaRepository::class,
    ];

    /**
     * @inheritdoc
     */
    public function register()
    {
        $this->container->share(MediaRepository::class, function () {
            return $this->container->get(DbalMediaRepository::class);
        });
    }
}
