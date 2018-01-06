<?php

namespace WouterDeSchuyter\Domain\Media;

use JsonSerializable;
use Mimey\MimeTypes;
use WouterDeSchuyter\Domain\Users\UserId;

class Media implements JsonSerializable
{
    /**
     * @var MediaId
     */
    private $id;

    /**
     * @var UserId
     */
    private $userId;

    /**
     * @var string
     */
    private $name;

    /**
     * @var string
     */
    private $url;

    /**
     * @var string
     */
    private $contentType;

    /**
     * @var int
     */
    private $size;

    /**
     * @var string
     */
    private $md5;

    /**
     * @var int
     */
    private $width;

    /**
     * @var int
     */
    private $height;

    /**
     * @var string
     */
    private $createdAt;

    /**
     * @param UserId $userId
     * @param string $name
     * @param string|null $url
     * @param string|null $contentType
     * @param int|null $size
     * @param string|null $md5
     * @param int|null $width
     * @param int|null $height
     */
    public function __construct(
        UserId $userId,
        string $name,
        string $url = null,
        string $contentType = null,
        int $size = null,
        string $md5 = null,
        int $width = null,
        int $height = null
    ) {
        $this->id = new MediaId();
        $this->userId = $userId;
        $this->name = $name;
        $this->url = $url;
        $this->contentType = $contentType;
        $this->size = $size;
        $this->md5 = $md5;
        $this->width = $width;
        $this->height = $height;
    }

    /**
     * @param array $data
     * @return Media
     */
    public static function fromArray(array $data): Media
    {
        $file = new Media(
            new UserId($data['user_id']),
            $data['name'],
            !empty($data['url']) ? $data['url'] : null,
            !empty($data['content_type']) ? $data['content_type'] : null,
            !empty($data['size']) ? $data['size'] : null,
            !empty($data['md5']) ? $data['md5'] : null,
            !empty($data['width']) ? $data['width'] : null,
            !empty($data['height']) ? $data['height'] : null
        );
        $file->id = new MediaId(!empty($data['id']) ? $data['id'] : null);
        $file->createdAt = !empty($data['created_at']) ? $data['created_at'] : null;

        return $file;
    }

    /**
     * @return MediaId
     */
    public function getId(): MediaId
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getPath(): string
    {
        if ($this->isYoutubeVideo()) {
            return null;
        }

        return '/' . $this->getId() . '.' . $this->getExtension();
    }

    /**
     * @return string
     */
    public function getExtension(): string
    {
        if ($this->isYoutubeVideo()) {
            return null;
        }

        $mimes = new MimeTypes();

        $extension = $mimes->getExtension($this->getContentType());

        // No extension found?
        if (empty($extension)) {
            $extension = 'bin';
        }

        return $extension;
    }

    /**
     * @return UserId
     */
    public function getUserId(): UserId
    {
        return $this->userId;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string|null
     */
    public function getUrl(): ?string
    {
        return $this->url;
    }

    /**
     * @return string|null
     */
    public function getContentType(): ?string
    {
        return $this->contentType;
    }

    /**
     * @return int|null
     */
    public function getSize(): ?int
    {
        return $this->size;
    }

    /**
     * @return string|null
     */
    public function getMd5(): ?string
    {
        return $this->md5;
    }

    /**
     * @param string $md5
     */
    public function setMd5(string $md5): void
    {
        $this->md5 = $md5;
    }

    /**
     * @return string
     */
    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    /**
     * @return bool
     */
    public function isImage(): bool
    {
        return stripos($this->getContentType(), 'image/') !== false;
    }

    /**
     * @return bool
     */
    public function isYoutubeVideo(): bool
    {
        return stripos($this->getUrl(), 'youtu.be') !== false;
    }

    /**
     * @return bool
     */
    public function isVimeoVideo(): bool
    {
        return stripos($this->getUrl(), 'vimeo.com') !== false;
    }

    /**
     * @return float|null
     */
    public function getRatio(): ?float
    {
        if (!$this->isImage() && !$this->isYoutubeVideo() && !$this->isVimeoVideo()) {
            return null;
        }

        return ($this->getHeight() / $this->getWidth()) * 100;
    }

    /**
     * @return int
     */
    public function getWidth(): ?int
    {
        return $this->width;
    }

    /**
     * @param int $width
     */
    public function setWidth(int $width): void
    {
        $this->width = $width;
    }

    /**
     * @return int
     */
    public function getHeight(): ?int
    {
        return $this->height;
    }

    /**
     * @param int $height
     */
    public function setHeight(int $height): void
    {
        $this->height = $height;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return get_object_vars($this);
    }
}
