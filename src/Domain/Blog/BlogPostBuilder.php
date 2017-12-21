<?php

namespace WouterDeSchuyter\Domain\Blog;

use WouterDeSchuyter\Domain\Media\MediaId;
use WouterDeSchuyter\Domain\Users\UserId;
use WouterDeSchuyter\Infrastructure\ValueObjects\DateTime;

class BlogPostBuilder
{
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
     * @param UserId $userId
     * @return BlogPostBuilder
     */
    public function setUserId(UserId $userId): BlogPostBuilder
    {
        $this->userId = $userId;

        return $this;
    }

    /**
     * @param MediaId $mediaId
     * @return BlogPostBuilder
     */
    public function setMediaId(MediaId $mediaId): BlogPostBuilder
    {
        $this->mediaId = $mediaId;

        return $this;
    }

    /**
     * @param string $title
     * @return BlogPostBuilder
     */
    public function setTitle(string $title): BlogPostBuilder
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @param string $slug
     * @return BlogPostBuilder
     */
    public function setSlug(string $slug): BlogPostBuilder
    {
        $this->slug = $slug;

        return $this;
    }

    /**
     * @param string $excerpt
     * @return BlogPostBuilder
     */
    public function setExcerpt(string $excerpt): BlogPostBuilder
    {
        $this->excerpt = $excerpt;

        return $this;
    }

    /**
     * @param string $body
     * @return BlogPostBuilder
     */
    public function setBody(string $body): BlogPostBuilder
    {
        $this->body = $body;

        return $this;
    }

    /**
     * @param DateTime $publishedAt
     * @return BlogPostBuilder
     */
    public function setPublishedAt(DateTime $publishedAt): BlogPostBuilder
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    /**
     * @return BlogPost
     */
    public function build(): BlogPost
    {
        return new BlogPost(
            $this->userId,
            $this->mediaId,
            $this->title,
            $this->slug,
            $this->excerpt,
            $this->body,
            $this->publishedAt
        );
    }
}
