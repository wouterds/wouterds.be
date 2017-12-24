<?php

namespace WouterDeSchuyter\Domain\Commands\Blog;

use WouterDeSchuyter\Domain\Blog\BlogPostId;
use WouterDeSchuyter\Domain\Media\MediaId;
use WouterDeSchuyter\Domain\Users\UserId;
use WouterDeSchuyter\Infrastructure\ValueObjects\DateTime;

class SaveBlogPost
{
    /**
     * @var BlogPostId
     */
    private $blogPostId;

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
    private $body;

    /**
     * @var string
     */
    private $excerpt;

    /**
     * @var UserId
     */
    private $userId;

    /**
     * @var MediaId
     */
    private $mediaId;

    /**
     * @var DateTime
     */
    private $publishedAt;

    /**
     * @param BlogPostId $blogPostId
     * @param string $title
     * @param string $slug
     * @param string $body
     * @param string $excerpt
     * @param UserId $userId
     * @param MediaId $mediaId
     * @param DateTime $dateTime
     */
    public function __construct(
        BlogPostId $blogPostId = null,
        string $title,
        string $slug,
        string $body,
        string $excerpt,
        UserId $userId,
        MediaId $mediaId,
        DateTime $dateTime
    ) {
        $this->blogPostId = $blogPostId;
        $this->title = $title;
        $this->slug = $slug;
        $this->body = $body;
        $this->excerpt = $excerpt;
        $this->userId = $userId;
        $this->mediaId = $mediaId;
        $this->publishedAt = $dateTime;
    }

    /**
     * @return BlogPostId|null
     */
    public function getBlogPostId(): ?BlogPostId
    {
        return $this->blogPostId;
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @return string
     */
    public function getSlug(): string
    {
        return $this->slug;
    }

    /**
     * @return string
     */
    public function getBody(): string
    {
        return $this->body;
    }

    /**
     * @return string
     */
    public function getExcerpt(): string
    {
        return $this->excerpt;
    }

    /**
     * @return UserId
     */
    public function getUserId(): UserId
    {
        return $this->userId;
    }

    /**
     * @return MediaId
     */
    public function getMediaId(): MediaId
    {
        return $this->mediaId;
    }

    /**
     * @return DateTime
     */
    public function getPublishedAt(): DateTime
    {
        return $this->publishedAt;
    }
}
