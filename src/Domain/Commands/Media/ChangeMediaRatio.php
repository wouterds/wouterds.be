<?php

namespace WouterDeSchuyter\Domain\Commands\Media;

use WouterDeSchuyter\Domain\Media\MediaId;

class ChangeMediaRatio
{
    /**
     * @var MediaId
     */
    private $mediaId;

    /**
     * @var float
     */
    private $ratio;

    /**
     * @var int
     */
    private $width;

    /**
     * @param MediaId $mediaId
     * @param float $ratio
     * @param int $width
     */
    public function __construct(MediaId $mediaId, float $ratio, int $width)
    {
        $this->mediaId = $mediaId;
        $this->ratio = $ratio;
        $this->width = $width;
    }

    /**
     * @return MediaId
     */
    public function getMediaId(): MediaId
    {
        return $this->mediaId;
    }

    /**
     * @return float
     */
    public function getRatio(): float
    {
        return $this->ratio;
    }

    /**
     * @return int
     */
    public function getWidth(): int
    {
        return $this->width;
    }
}
