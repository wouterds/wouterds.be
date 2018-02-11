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
    private $maxWidth;

    /**
     * @param MediaId $mediaId
     * @param float $ratio
     * @param int $maxWidth
     */
    public function __construct(MediaId $mediaId, float $ratio, int $maxWidth)
    {
        $this->mediaId = $mediaId;
        $this->ratio = $ratio;
        $this->maxWidth = $maxWidth;
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
    public function getMaxWidth(): int
    {
        return $this->maxWidth;
    }
}
