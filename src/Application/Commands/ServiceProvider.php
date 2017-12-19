<?php

namespace WouterDeSchuyter\Application\Commands;

use League\Container\ServiceProvider\AbstractServiceProvider;
use League\Tactician\CommandBus;
use League\Tactician\Container\ContainerLocator;
use League\Tactician\Handler\CommandHandlerMiddleware;
use League\Tactician\Handler\CommandNameExtractor\ClassNameExtractor;
use League\Tactician\Handler\MethodNameInflector\HandleInflector;
use WouterDeSchuyter\Domain\Commands\ContactEnquiry;
use WouterDeSchuyter\Domain\Commands\SignInUser;
use WouterDeSchuyter\Domain\Commands\SignOutUser;
use WouterDeSchuyter\Domain\Commands\SignUpUser;

class ServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        CommandBus::class,
    ];

    /**
     * @inheritdoc
     */
    public function register()
    {
        $this->container->share(CommandBus::class, function () {
            $locator = new ContainerLocator($this->container, [
                ContactEnquiry::class => ContactEnquiryHandler::class,
                SignInUser::class => SignInUserHandler::class,
                SignUpUser::class => SignUpUserHandler::class,
                SignOutUser::class => SignOutUserHandler::class,
            ]);

            $handlerMiddleware = new CommandHandlerMiddleware(
                new ClassNameExtractor(),
                $locator,
                new HandleInflector()
            );

            return new CommandBus([$handlerMiddleware]);
        });
    }
}
