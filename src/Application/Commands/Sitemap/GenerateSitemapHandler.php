<?php

namespace WouterDeSchuyter\Application\Commands\Sitemap;

use League\Tactician\CommandBus;
use samdark\sitemap\Sitemap;
use Slim\Router;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Domain\Commands\Sitemap\GenerateSitemap;
use WouterDeSchuyter\Domain\Commands\Sitemap\PingSearchEngines;
use WouterDeSchuyter\Infrastructure\Config\Config;

class GenerateSitemapHandler
{
    /**
     * @var Config
     */
    private $config;

    /**
     * @var Router
     */
    private $router;

    /**
     * @var BlogPostRepository
     */
    private $blogPostRepository;

    /**
     * @var CommandBus
     */
    private $commandBus;

    /**
     * @param Config $config
     * @param Router $router
     * @param BlogPostRepository $blogPostRepository
     * @param CommandBus $commandBus
     */
    public function __construct(
        Config $config,
        Router $router,
        BlogPostRepository $blogPostRepository,
        CommandBus $commandBus
    ) {
        $this->config = $config;
        $this->router = $router;
        $this->blogPostRepository = $blogPostRepository;
        $this->commandBus = $commandBus;
    }

    /**
     * @param GenerateSitemap $generateSitemap
     */
    public function handle(GenerateSitemap $generateSitemap)
    {
        // Create sitemap
        $sitemap = new Sitemap(APP_DIR . '/public/sitemap.xml');

        // Add top level urls
        $sitemap->addItem(
            $this->config->get('APP_URL'),
            time(),
            Sitemap::WEEKLY,
            1.0
        );
        $sitemap->addItem(
            $this->config->get('APP_URL') . $this->router->pathFor('about'),
            time(),
            Sitemap::WEEKLY,
            0.9
        );
        $sitemap->addItem(
            $this->config->get('APP_URL') . $this->router->pathFor('blog'),
            time(),
            Sitemap::DAILY,
            0.9
        );
        $sitemap->addItem(
            $this->config->get('APP_URL') . $this->router->pathFor('contact'),
            time(),
            Sitemap::WEEKLY,
            0.9
        );
        $sitemap->addItem(
            $this->config->get('APP_URL') . $this->router->pathFor('stats'),
            time(),
            Sitemap::WEEKLY,
            0.9
        );

        // Add blog urls
        foreach ($this->blogPostRepository->findPublished() as $blogPost) {
            $lastModified = $blogPost->getPublishedAt();
            if ($blogPost->getUpdatedAt()) {
                $lastModified = $blogPost->getUpdatedAt();
            }

            $sitemap->addItem(
                $this->config->get('APP_URL') . $this->router->pathFor('blog.detail', [
                    'slug' => $blogPost->getSlug(),
                ]),
                (int) $lastModified->format('U'),
                Sitemap::WEEKLY,
                0.7
            );
        }

        // Write sitemap
        $sitemap->write();

        if ($generateSitemap->getPingSearchEngines()) {
            $this->commandBus->handle(new PingSearchEngines());
        }
    }
}
