<?php

namespace WouterDeSchuyter\Application\Blog;

use Doctrine\DBAL\Connection;
use WouterDeSchuyter\Domain\Blog\BlogPost;
use WouterDeSchuyter\Domain\Blog\BlogPostId;
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
        $query->set('user_id', $query->createNamedParameter((string) $blogPost->getUserId()));
        $query->set('media_id', $query->createNamedParameter((string) $blogPost->getMediaId()));
        $query->set('title', $query->createNamedParameter($blogPost->getTitle()));
        $query->set('slug', $query->createNamedParameter($blogPost->getSlug()));
        $query->set('excerpt', $query->createNamedParameter($blogPost->getExcerpt()));
        $query->set('body', $query->createNamedParameter($blogPost->getBody()));
        $query->set('published_at', $query->createNamedParameter($blogPost->getPublishedAt()));
        $query->set('updated_at', 'NOW()');
        $query->where('id = ' . $query->createNamedParameter((string) $blogPost->getId()));
        $query->execute();
    }

    /**
     * @return BlogPost[]
     */
    public function findAll(): array
    {
        $query = $this->connection->createQueryBuilder();
        $query->select('*');
        $query->from(self::TABLE);
        $query->where('deleted_at IS NULL');
        $query->orderBy('created_at', 'DESC');
        $rows = $query->execute()->fetchAll();

        if (empty($rows)) {
            return [];
        }

        $data = [];
        foreach ($rows as $row) {
            $blogPost = BlogPost::fromArray($row);

            $data[$blogPost->getId()->getValue()] = $blogPost;
        }

        return $data;
    }

    /**
     * @param BlogPostId $id
     * @return BlogPost|null
     */
    public function find(BlogPostId $id): ?BlogPost
    {
        $query = $this->connection->createQueryBuilder();
        $query->select('*');
        $query->from(self::TABLE);
        $query->where('id = ' . $query->createNamedParameter($id));
        $result = $query->execute()->fetch();

        if (empty($result)) {
            return null;
        }

        return BlogPost::fromArray($result);
    }

    /**
     * @return BlogPost[]
     */
    public function findPublished(): array
    {
        $query = $this->connection->createQueryBuilder();
        $query->select('*');
        $query->from(self::TABLE);
        $query->where('published_at IS NOT NULL');
        $query->andWhere('deleted_at IS NULL');
        $query->orderBy('created_at', 'DESC');
        $rows = $query->execute()->fetchAll();

        if (empty($rows)) {
            return [];
        }

        $data = [];
        foreach ($rows as $row) {
            $blogPost = BlogPost::fromArray($row);

            $data[$blogPost->getId()->getValue()] = $blogPost;
        }

        return $data;
    }

    /**
     * @param string $slug
     * @return BlogPost|null
     */
    public function findBySlug(string $slug): ?BlogPost
    {
        $query = $this->connection->createQueryBuilder();
        $query->select('*');
        $query->from(self::TABLE);
        $query->where('slug = ' . $query->createNamedParameter($slug));
        $result = $query->execute()->fetch();

        if (empty($result)) {
            return null;
        }

        return BlogPost::fromArray($result);
    }

    /**
     * @param BlogPostId $id
     */
    public function delete(BlogPostId $id)
    {
        $query = $this->connection->createQueryBuilder();
        $query->update(self::TABLE);
        $query->set('updated_at', 'NOW()');
        $query->set('deleted_at', 'NOW()');
        $query->where('id = ' . $query->createNamedParameter($id));
        $query->execute();
    }
}
