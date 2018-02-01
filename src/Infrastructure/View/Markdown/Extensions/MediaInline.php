<?php

namespace WouterDeSchuyter\Infrastructure\View\Markdown\Extensions;

use League\CommonMark\Inline\Element\HtmlInline;
use WouterDeSchuyter\Domain\Media\MediaId;

class MediaInline extends HtmlInline
{
    /**
     * @var MediaId
     */
    private $mediaId;

    /**
     * @var bool
     */
    private $ampEnabled;

    /**
     * @param MediaId $mediaId
     */
    public function setMediaId(MediaId $mediaId): void
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

    /**
     * @param bool $ampEnabled
     */
    public function setAmpEnabled(bool $ampEnabled)
    {
        $this->ampEnabled = $ampEnabled;
    }

    /**
     * @return bool
     */
    public function isAmpEnabled(): bool
    {
        return $this->ampEnabled;
    }
}
