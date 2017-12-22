<?php

namespace WouterDeSchuyter\Infrastructure\View;

use League\Container\ServiceProvider\AbstractServiceProvider;
use League\Container\ServiceProvider\BootableServiceProviderInterface;
use nochso\HtmlCompressTwig\Extension as CompressHtmlExtension;
use Slim\Http\Request;
use Slim\Router;
use SPE\FilesizeExtensionBundle\Twig\FilesizeExtension;
use Twig_Loader_Filesystem;
use WouterDeSchuyter\Infrastructure\ApplicationMonitor\ApplicationMonitor;
use WouterDeSchuyter\Infrastructure\Config\Config;

class ServiceProvider extends AbstractServiceProvider implements BootableServiceProviderInterface
{
    /**
     * @var array
     */
    protected $provides = [
        Twig::class,
    ];

    /**
     * @inheritdoc
     */
    public function register()
    {
        $this->container->share(Twig::class, function () {
            $loader = new Twig_Loader_Filesystem(APP_DIR . '/' . getenv('TEMPLATES_DIR'));
            $twig = new Twig($loader);
            $twig->addExtension(new FilesizeExtension());
            $twig->addExtension(new CompressHtmlExtension());

            return $twig;
        });
    }

    /**
     * @inheritdoc
     */
    public function boot()
    {
        $this->container->inflector(ViewAwareInterface::class)->invokeMethods([
            'setTwig' => [Twig::class],
            'setConfig' => [Config::class],
            'setRouter' => [Router::class],
            'setRequest' => [Request::class],
            'setApplicationMonitor' => [ApplicationMonitor::class],
        ]);
    }
}
