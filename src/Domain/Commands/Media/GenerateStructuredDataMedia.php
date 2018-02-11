<?php

namespace WouterDeSchuyter\Domain\Commands\Media;

use WouterDeSchuyter\Domain\Media\MediaId;

class GenerateStructuredDataMedia
{
    /**
     * @var MediaId
     */
    private $mediaId;

    /**
     * @param MediaId $mediaId
     */
    public function __construct(MediaId $mediaId)
    {
        $this->mediaId = $mediaId;
    }

    /**
     * @return MediaId
     */
    public function getMediaId(): MediaId
    {
        return $this->mediaId;
    }
}
