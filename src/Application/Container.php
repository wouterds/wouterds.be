<?php

namespace WouterDeSchuyter\Application;

use League\Container\Container as LeagueContainer;
use League\Container\ReflectionContainer;
use WouterDeSchuyter\Application\AccessLogs\ServiceProvider as AccessLogsServiceProvider;
use WouterDeSchuyter\Application\Blog\ServiceProvider as BlogServiceProvider;
use WouterDeSchuyter\Application\Commands\ServiceProvider as CommandsServiceProvider;
use WouterDeSchuyter\Application\Http\ServiceProvider as HttpServiceProvider;
use WouterDeSchuyter\Application\Media\ServiceProvider as MediaServiceProvider;
use WouterDeSchuyter\Application\Users\ServiceProvider as UsersServiceProvider;
use WouterDeSchuyter\Infrastructure\ApplicationMonitor\ServiceProvider as ApplicationMonitorServiceProvider;
use WouterDeSchuyter\Infrastructure\Config\ServiceProvider as ConfigServiceProvider;
use WouterDeSchuyter\Infrastructure\Database\ServiceProvider as DatabaseServiceProvider;
use WouterDeSchuyter\Infrastructure\Filesystem\ServiceProvider as FilesystemServiceProvider;
use WouterDeSchuyter\Infrastructure\ImageManager\ServiceProvider as ImagesServiceProvider;
use WouterDeSchuyter\Infrastructure\Mail\ServiceProvider as MailServiceProvider;
use WouterDeSchuyter\Infrastructure\View\ServiceProvider as ViewServiceProvider;
use WouterDeSchuyter\Infrastructure\Vimeo\ServiceProvider as VimeoServiceProvider;
use WouterDeSchuyter\Infrastructure\Youtube\ServiceProvider as YoutubeServiceProvider;

class Container extends LeagueContainer
{
    /**
     * @return Container
     */
    public static function load()
    {
        $container = new static();
        $container->delegate(new ReflectionContainer());

        $container->addServiceProvider(AccessLogsServiceProvider::class);
        $container->addServiceProvider(CommandsServiceProvider::class);
        $container->addServiceProvider(HttpServiceProvider::class);
        $container->addServiceProvider(BlogServiceProvider::class);
        $container->addServiceProvider(MediaServiceProvider::class);
        $container->addServiceProvider(UsersServiceProvider::class);
        $container->addServiceProvider(ApplicationMonitorServiceProvider::class);
        $container->addServiceProvider(ConfigServiceProvider::class);
        $container->addServiceProvider(DatabaseServiceProvider::class);
        $container->addServiceProvider(FilesystemServiceProvider::class);
        $container->addServiceProvider(ImagesServiceProvider::class);
        $container->addServiceProvider(MailServiceProvider::class);
        $container->addServiceProvider(ViewServiceProvider::class);
        $container->addServiceProvider(VimeoServiceProvider::class);
        $container->addServiceProvider(YoutubeServiceProvider::class);

        return $container;
    }
}
