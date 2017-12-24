<?php

namespace WouterDeSchuyter\Domain\Blog;

use WouterDeSchuyter\Domain\Media\MediaId;
use WouterDeSchuyter\Domain\Users\UserId;
use WouterDeSchuyter\Infrastructure\ValueObjects\DateTime;

class BlogPostBuilder
{
    /**
     * @var BlogPostId
     */
    private $id;

    /**
     * @var UserId
     */
    private $userId;

    /**
     * @var MediaId
     */
    private $mediaId;

    /**
     * @var string
     */
    private $title;

    /**
     * @var string
     */
    private $slug;

    /**
     * @var string
     */
    private $excerpt;

    /**
     * @var string
     */
    private $body;

    /**
     * @var DateTime
     */
    private $publishedAt;

    /**
     * @return BlogPostBuilder
     */
    public static function startWithDefault()
    {
        $factory = new self();

        return $factory;
    }

    /**
     * @param BlogPostId $id
     * @return BlogPostBuilder
     */
    public function withId(BlogPostId $id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @param UserId $userId
     * @return BlogPostBuilder
     */
    public function withUserId(UserId $userId): BlogPostBuilder
    {
        $this->userId = $userId;

        return $this;
    }

    /**
     * @param MediaId $mediaId
     * @return BlogPostBuilder
     */
    public function withMediaId(MediaId $mediaId): BlogPostBuilder
    {
        $this->mediaId = $mediaId;

        return $this;
    }

    /**
     * @param string $title
     * @return BlogPostBuilder
     */
    public function withTitle(string $title): BlogPostBuilder
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @param string $slug
     * @return BlogPostBuilder
     */
    public function withSlug(string $slug): BlogPostBuilder
    {
        $this->slug = $slug;

        return $this;
    }

    /**
     * @param string $excerpt
     * @return BlogPostBuilder
     */
    public function withExcerpt(string $excerpt): BlogPostBuilder
    {
        $this->excerpt = $excerpt;

        return $this;
    }

    /**
     * @param string $body
     * @return BlogPostBuilder
     */
    public function withBody(string $body): BlogPostBuilder
    {
        $this->body = $body;

        return $this;
    }

    /**
     * @param DateTime $publishedAt
     * @return BlogPostBuilder
     */
    public function withPublishedAt(DateTime $publishedAt): BlogPostBuilder
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    /**
     * @return BlogPost
     */
    public function build(): BlogPost
    {
        return BlogPost::fromArray([
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'media_id' => $this->mediaId,
            'user_id' => $this->userId,
            'published_at' => $this->publishedAt,
        ]);
    }
}
