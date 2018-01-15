<?php

namespace WouterDeSchuyter\Application\Console\Commands;

use samdark\sitemap\Sitemap;
use Slim\Router;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Infrastructure\Config\Config;

class GenerateSitemap extends Command
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
     * @param Config $config
     * @param Router $router
     * @param BlogPostRepository $blogPostRepository
     */
    public function __construct(Config $config, Router $router, BlogPostRepository $blogPostRepository)
    {
        $this->config = $config;
        $this->router = $router;
        $this->blogPostRepository = $blogPostRepository;

        parent::__construct(get_class($this));
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|null|void
     */
    protected function execute(InputInterface $input, OutputInterface $output)
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

        // Add blog urls
        foreach ($this->blogPostRepository->findAll() as $blogPost) {
            if (!$blogPost->getPublishedAt()) {
                continue;
            }

            $sitemap->addItem(
                $this->config->get('APP_URL') . $this->router->pathFor('blog.detail', [
                    'slug' => $blogPost->getSlug()
                ]),
                (int) $blogPost->getPublishedAt()->format('U'),
                Sitemap::WEEKLY,
                0.7
            );
        }

        // Write sitemap
        $sitemap->write();
    }
}
