<?php

namespace WouterDeSchuyter\Application\Commands\Rss;

use Slim\Router;
use Suin\RSSWriter\Channel;
use Suin\RSSWriter\Feed;
use Suin\RSSWriter\Item;
use WouterDeSchuyter\Domain\Blog\BlogPost;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Domain\Commands\Rss\GenerateRss;
use WouterDeSchuyter\Domain\Users\User;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Infrastructure\Config\Config;

class GenerateRssHandler
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
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param Config $config
     * @param Router $router
     * @param BlogPostRepository $blogPostRepository
     * @param UserRepository $userRepository
     */
    public function __construct(
        Config $config,
        Router $router,
        BlogPostRepository $blogPostRepository,
        UserRepository $userRepository
    ) {
        $this->config = $config;
        $this->router = $router;
        $this->blogPostRepository = $blogPostRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * @param GenerateRss $generateRss
     */
    public function handle(GenerateRss $generateRss)
    {
        // Create feed
        $feed = new Feed();

        // Create channel
        $channel = new Channel();
        $channel->title($this->config->get('APP_NAME'));
        $channel->description($this->config->get('BLOG_DESCRIPTION'));
        $channel->url($this->config->get('APP_URL'));
        $channel->feedUrl($this->config->get('APP_URL') . '/rss.xml');
        $channel->pubDate(time());
        $channel->lastBuildDate(time());
        $channel->ttl(60 * 4); // 6 hours
        $channel->appendTo($feed);

        // Get blogposts
        $blogPosts = $this->blogPostRepository->findPublished();

        // Get user ids from blogposts
        $userIds = array_map(function ($blogPost) {
            /** @var BlogPost $blogPost */
            return $blogPost->getUserId();
        }, $blogPosts);

        // Get users
        $users = $this->userRepository->findMultiple($userIds);

        // Add items
        foreach ($blogPosts as $blogPost) {
            /** @var User $user */
            $user = $users[(string) $blogPost->getUserId()];

            $lastModified = $blogPost->getPublishedAt();
            if ($blogPost->getUpdatedAt()) {
                $lastModified = $blogPost->getUpdatedAt();
            }

            $url = $this->config->get('APP_URL') . $this->router->pathFor('blog.detail', [
                'slug' => $blogPost->getSlug(),
            ]);

            $item = new Item();
            $item->title($blogPost->getTitle());
            $item->description($blogPost->getExcerpt());
            $item->url($url);
            $item->guid($url, true);
            $item->pubDate((int) $lastModified->format('U'));
            $item->author($user->getName());
            $item->appendTo($channel);
        }

        file_put_contents(APP_DIR . '/public/rss.xml', $feed->render());
    }
}
