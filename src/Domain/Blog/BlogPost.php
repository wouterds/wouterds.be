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
     * @var int
     */
    private $views = 0;

    /**
     * @var DateTime
     */
    private $publishedAt;

    /**
     * @var DateTime
     */
    private $createdAt;

    /**
     * @var DateTime
     */
    private $updatedAt;

    /**
     * @param UserId $userId
     * @param MediaId $mediaId
     * @param string $title
     * @param string $slug
     * @param string $excerpt
     * @param string $body
     * @param DateTime|null $publishedAt
     */
    public function __construct(
        UserId $userId,
        MediaId $mediaId,
        string $title,
        string $slug,
        string $excerpt,
        string $body,
        DateTime $publishedAt = null
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
     * @param array $data
     * @return BlogPost
     */
    public static function fromArray(array $data): BlogPost
    {
        $file = new BlogPost(
            new UserId($data['user_id']),
            new MediaId($data['media_id']),
            $data['title'],
            $data['slug'],
            $data['excerpt'],
            $data['body'],
            !empty($data['published_at']) ? new DateTime($data['published_at']) : null
        );
        $file->id = new BlogPostId(!empty($data['id']) ? $data['id'] : null);
        $file->views = (int) $data['views'];
        $file->createdAt = !empty($data['created_at']) ? new DateTime($data['created_at']) : null;
        $file->updatedAt = !empty($data['updated_at']) ? new DateTime($data['updated_at']) : null;

        return $file;
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
     * @return int
     */
    public function getViews(): int
    {
        return $this->views;
    }

    /**
     * @return DateTime|null
     */
    public function getPublishedAt(): ?DateTime
    {
        return $this->publishedAt;
    }

    /**
     * @return DateTime|null
     */
    public function getCreatedAt(): ?DateTime
    {
        return $this->createdAt;
    }

    /**
     * @return DateTime|null
     */
    public function getUpdatedAt(): ?DateTime
    {
        return $this->updatedAt;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return get_object_vars($this);
    }
}
