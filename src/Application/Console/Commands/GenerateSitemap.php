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

        // Ping search engines
        $this->pingSearchEngines();
    }

    private function pingSearchEngines()
    {
        $sitemapUrl = urlencode($this->config->get('APP_URL') . '/sitemap.xml');

        $searchEnginePingUrls = [
            "http://www.google.com/webmasters/sitemaps/ping?sitemap={$sitemapUrl}",
            "http://www.bing.com/ping?siteMap={$sitemapUrl}",
            "http://submissions.ask.com/ping?sitemap={$sitemapUrl}",
        ];

        foreach ($searchEnginePingUrls as $searchEnginePingUrl) {
            self::ping($searchEnginePingUrl);
        }
    }

    private static function ping(string $url)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $statusCode;
    }
}
