<?php

namespace WouterDeSchuyter\Domain\Media;

use WouterDeSchuyter\Domain\Users\UserId;

class MediaBuilder
{
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
     * @return MediaBuilder
     */
    public static function startWithDefault()
    {
        $factory = new self();
        return $factory;
    }

    /**
     * @param UserId $userId
     * @return MediaBuilder
     */
    public function withUserId(UserId $userId): MediaBuilder
    {
        $this->userId = $userId;

        return $this;
    }

    /**
     * @param string $name
     * @return MediaBuilder
     */
    public function withName(string $name): MediaBuilder
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @param string $url
     * @return MediaBuilder
     */
    public function withUrl(string $url): MediaBuilder
    {
        $this->url = $url;

        return $this;
    }

    /**
     * @param string $contentType
     * @return MediaBuilder
     */
    public function withContentType(string $contentType): MediaBuilder
    {
        $this->contentType = $contentType;

        return $this;
    }

    /**
     * @param int $size
     * @return MediaBuilder
     */
    public function withSize(int $size): MediaBuilder
    {
        $this->size = $size;

        return $this;
    }

    /**
     * @param string $md5
     * @return MediaBuilder
     */
    public function withMd5(string $md5): MediaBuilder
    {
        $this->md5 = $md5;

        return $this;
    }

    /**
     * @return Media
     */
    public function build()
    {
        return new Media(
            $this->userId,
            $this->name,
            $this->url,
            $this->contentType,
            $this->size,
            $this->md5
        );
    }
}
