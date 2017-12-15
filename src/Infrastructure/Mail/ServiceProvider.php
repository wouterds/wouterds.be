<?php

namespace WouterDeSchuyter\Infrastructure\Mail;

use League\Container\ServiceProvider\AbstractServiceProvider;

class ServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        Mailer::class,
    ];

    /**
     * {@inheritdoc}
     */
    public function register()
    {
    }
}
