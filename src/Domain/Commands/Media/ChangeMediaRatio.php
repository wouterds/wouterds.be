<?php

namespace WouterDeSchuyter\Domain\Commands\Media;

use InvalidArgumentException;
use WouterDeSchuyter\Domain\Media\MediaId;

class ChangeMediaRatio
{
    /**
     * @var MediaId
     */
    private $mediaId;

    /**
     * @var string
     */
    private $ratioStringValue;

    /**
     * @var int
     */
    private $width;

    /**
     * @param MediaId $mediaId
     * @param string $ratioStringValue
     * @param int $width
     */
    public function __construct(MediaId $mediaId, string $ratioStringValue, int $width)
    {
        $ratio = explode(':', $ratioStringValue);

        if (count($ratio) < 2) {
            throw new InvalidArgumentException('Ratio should be of the format "x:y", eg: "16:9".');
        }

        if (!is_numeric($ratio[0]) || !is_numeric($ratio[1])) {
            throw new InvalidArgumentException('Ratio should be of the format "x:y", eg: "16:9".');
        }

        $this->mediaId = $mediaId;
        $this->ratioStringValue = $ratioStringValue;
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
     * Eg: 16:9
     * @return string
     */
    public function getRatioStringValue(): string
    {
        return $this->ratioStringValue;
    }

    /**
     * @return float
     */
    public function getRatio(): float
    {
        $ratio = explode(':', $this->ratioStringValue);

        return $ratio[0] / $ratio[1];
    }

    /**
     * @return int
     */
    public function getWidth(): int
    {
        return $this->width;
    }
}
