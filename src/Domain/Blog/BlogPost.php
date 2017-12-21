<?php

namespace WouterDeSchuyter\Domain\Blog;

use JsonSerializable;
use WouterDeSchuyter\Domain\Media\MediaId;
use WouterDeSchuyter\Domain\Users\UserId;
use WouterDeSchuyter\Infrastructure\ValueObjects\DateTime;

class BlogPost implements JsonSerializable
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
     * @param UserId $userId
     * @param MediaId $mediaId
     * @param string $title
     * @param string $slug
     * @param string $excerpt
     * @param string $body
     * @param DateTime $publishedAt
     */
    public function __construct(
        UserId $userId,
        MediaId $mediaId,
        string $title,
        string $slug,
        string $excerpt,
        string $body,
        DateTime $publishedAt
    ) {
        $this->id = new BlogPostId();
        $this->userId = $userId;
        $this->mediaId = $mediaId;
        $this->title = $title;
        $this->slug = $slug;
        $this->excerpt = $excerpt;
        $this->body = $body;
        $this->publishedAt = $publishedAt;
    }

    /**
     * @return BlogPostId
     */
    public function getId(): BlogPostId
    {
        return $this->id;
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
    public function getExcerpt(): string
    {
        return $this->excerpt;
    }

    /**
     * @return string
     */
    public function getBody(): string
    {
        return $this->body;
    }

    /**
     * @return DateTime
     */
    public function getPublishedAt(): DateTime
    {
        return $this->publishedAt;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return get_object_vars($this);
    }
}
