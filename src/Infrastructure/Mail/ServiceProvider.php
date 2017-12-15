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
        $this->container->share(Mailer::class, function () {
            return new SparkPostMailer(getenv('SPARKPOST_API_KEY'));
        });
    }
}
