<?php

namespace WouterDeSchuyter\Application\Commands;

use League\Container\ServiceProvider\AbstractServiceProvider;
use League\Tactician\CommandBus;
use League\Tactician\Container\ContainerLocator;
use League\Tactician\Handler\CommandHandlerMiddleware;
use League\Tactician\Handler\CommandNameExtractor\ClassNameExtractor;
use League\Tactician\Handler\MethodNameInflector\HandleInflector;
use WouterDeSchuyter\Application\Commands\AccessLogs\EmptyAccessLogFileHandler;
use WouterDeSchuyter\Application\Commands\AccessLogs\ImportAccessLogsHandler;
use WouterDeSchuyter\Application\Commands\Blog\DeleteBlogPostHandler;
use WouterDeSchuyter\Application\Commands\Blog\GenerateStructuredDataForBlogPostsHandler;
use WouterDeSchuyter\Application\Commands\Blog\SaveBlogPostHandler;
use WouterDeSchuyter\Application\Commands\Media\AddMediaHandler;
use WouterDeSchuyter\Application\Commands\Media\ChangeMediaRatioHandler;
use WouterDeSchuyter\Application\Commands\Media\DeleteMediaHandler;
use WouterDeSchuyter\Application\Commands\Media\GenerateStructuredDataMediaHandler;
use WouterDeSchuyter\Application\Commands\Robots\GenerateRobotsHandler;
use WouterDeSchuyter\Application\Commands\Rss\GenerateRssHandler;
use WouterDeSchuyter\Application\Commands\Sitemap\GenerateSitemapHandler;
use WouterDeSchuyter\Application\Commands\Sitemap\PingSearchEnginesHandler;
use WouterDeSchuyter\Application\Commands\Users\ActivateUserHandler;
use WouterDeSchuyter\Application\Commands\Users\DeactivateUserHandler;
use WouterDeSchuyter\Application\Commands\Users\DeleteUserHandler;
use WouterDeSchuyter\Application\Commands\Users\SignOutUserHandler;
use WouterDeSchuyter\Application\Commands\Users\SignUpUserHandler;
use WouterDeSchuyter\Domain\Commands\AccessLogs\EmptyAccessLogFile;
use WouterDeSchuyter\Domain\Commands\AccessLogs\ImportAccessLogs;
use WouterDeSchuyter\Domain\Commands\Blog\DeleteBlogPost;
use WouterDeSchuyter\Domain\Commands\Blog\GenerateStructuredDataForBlogPosts;
use WouterDeSchuyter\Domain\Commands\Blog\SaveBlogPost;
use WouterDeSchuyter\Domain\Commands\ContactEnquiry;
use WouterDeSchuyter\Domain\Commands\Media\AddMedia;
use WouterDeSchuyter\Domain\Commands\Media\ChangeMediaRatio;
use WouterDeSchuyter\Domain\Commands\Media\DeleteMedia;
use WouterDeSchuyter\Domain\Commands\Media\GenerateStructuredDataMedia;
use WouterDeSchuyter\Domain\Commands\Robots\GenerateRobots;
use WouterDeSchuyter\Domain\Commands\Rss\GenerateRss;
use WouterDeSchuyter\Domain\Commands\Sitemap\GenerateSitemap;
use WouterDeSchuyter\Domain\Commands\Sitemap\PingSearchEngines;
use WouterDeSchuyter\Domain\Commands\Users\ActivateUser;
use WouterDeSchuyter\Domain\Commands\Users\DeactivateUser;
use WouterDeSchuyter\Domain\Commands\Users\DeleteUser;
use WouterDeSchuyter\Domain\Commands\Users\SignOutUser;
use WouterDeSchuyter\Domain\Commands\Users\SignUpUser;

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
                SignUpUser::class => SignUpUserHandler::class,
                SignOutUser::class => SignOutUserHandler::class,
                ActivateUser::class => ActivateUserHandler::class,
                DeactivateUser::class => DeactivateUserHandler::class,
                DeleteUser::class => DeleteUserHandler::class,
                AddMedia::class => AddMediaHandler::class,
                ChangeMediaRatio::class => ChangeMediaRatioHandler::class,
                DeleteMedia::class => DeleteMediaHandler::class,
                GenerateStructuredDataMedia::class => GenerateStructuredDataMediaHandler::class,
                GenerateStructuredDataForBlogPosts::class => GenerateStructuredDataForBlogPostsHandler::class,
                SaveBlogPost::class => SaveBlogPostHandler::class,
                DeleteBlogPost::class => DeleteBlogPostHandler::class,
                GenerateRobots::class => GenerateRobotsHandler::class,
                GenerateRss::class => GenerateRssHandler::class,
                GenerateSitemap::class => GenerateSitemapHandler::class,
                PingSearchEngines::class => PingSearchEnginesHandler::class,
                ImportAccessLogs::class => ImportAccessLogsHandler::class,
                EmptyAccessLogFile::class => EmptyAccessLogFileHandler::class,
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
