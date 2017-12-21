<?php

namespace WouterDeSchuyter\Application\Blog;

use Doctrine\DBAL\Connection;
use WouterDeSchuyter\Domain\Blog\BlogPost;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;

class DbalBlogPostRepository implements BlogPostRepository
{
    public const TABLE = 'blog_post';

    /**
     * @var Connection
     */
    private $connection;

    /**
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    /**
     * @param BlogPost $blogPost
     */
    public function add(BlogPost $blogPost)
    {
        $this->connection->insert(self::TABLE, [
            'id' => $blogPost->getId(),
            'user_id' => $blogPost->getUserId(),
            'media_id' => $blogPost->getMediaId(),
            'title' => $blogPost->getTitle(),
            'slug' => $blogPost->getSlug(),
            'excerpt' => $blogPost->getExcerpt(),
            'body' => $blogPost->getBody(),
            'published_at' => $blogPost->getPublishedAt(),
        ]);
    }
}
