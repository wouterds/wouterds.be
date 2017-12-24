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

    /**
     * @param BlogPost $blogPost
     */
    public function update(BlogPost $blogPost)
    {
        $query = $this->connection->createQueryBuilder();
        $query->update(self::TABLE);
        $query->setValue('user_id', $query->createNamedParameter($blogPost->getUserId()));
        $query->setValue('media_id', $query->createNamedParameter($blogPost->getMediaId()));
        $query->setValue('title', $query->createNamedParameter($blogPost->getTitle()));
        $query->setValue('slug', $query->createNamedParameter($blogPost->getSlug()));
        $query->setValue('excerpt', $query->createNamedParameter($blogPost->getExcerpt()));
        $query->setValue('body', $query->createNamedParameter($blogPost->getBody()));
        $query->setValue('published_at', $query->createNamedParameter($blogPost->getPublishedAt()));
        $query->setValue('updated_at', 'NOW()');
        $query->where('id', $blogPost->getId());
        $query->execute();
    }
}
