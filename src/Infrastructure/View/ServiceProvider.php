<?php

namespace WouterDeSchuyter\Infrastructure\View;

use Aptoma\Twig\Extension\MarkdownEngine\PHPLeagueCommonMarkEngine as CommonMarkEngine;
use Aptoma\Twig\Extension\MarkdownExtension;
use League\CommonMark\CommonMarkConverter;
use League\CommonMark\Environment as CommonMarkEnvironment;
use League\Container\ServiceProvider\AbstractServiceProvider;
use League\Container\ServiceProvider\BootableServiceProviderInterface;
use nochso\HtmlCompressTwig\Extension as CompressHtmlExtension;
use Slim\Http\Request;
use Slim\Router;
use SPE\FilesizeExtensionBundle\Twig\FilesizeExtension;
use Twig_Loader_Filesystem;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Infrastructure\ApplicationMonitor\ApplicationMonitor;
use WouterDeSchuyter\Infrastructure\Config\Config;
use WouterDeSchuyter\Infrastructure\Database\SQLLogger;
use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareInterface as AdminViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\Markdown\Extensions\MediaInlineExtension;

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

            $commonMarkEnvironment = CommonMarkEnvironment::createCommonMarkEnvironment();
            $markdownMediaExtension = $this->container->get(MediaInlineExtension::class);
            $request = $this->container->get(Request::class);
            $markdownMediaExtension->setAmpEnabled(substr_count($request->getUri()->getPath(), '/amp') > 0);
            $commonMarkEnvironment->addExtension($markdownMediaExtension);
            $commonMarkConverter = new CommonMarkConverter([], $commonMarkEnvironment);
            $twig->addExtension(new MarkdownExtension(new CommonMarkEngine($commonMarkConverter)));

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
            'setSqlLogger' => [SQLLogger::class],
        ]);

        $this->container->inflector(AdminViewAwareInterface::class)->invokeMethods([
            'setAuthenticatedUser' => [AuthenticatedUser::class],
        ]);
    }
}
