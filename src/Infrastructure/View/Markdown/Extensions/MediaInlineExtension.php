<?php

namespace WouterDeSchuyter\Infrastructure\View\Markdown\Extensions;

use League\CommonMark\Extension\Extension;

class MediaInlineExtension extends Extension
{
    /**
     * @var MediaInlineParser
     */
    private $mediaInlineParser;

    /**
     * @var MediaInlineRenderer
     */
    private $mediaInlineRenderer;

    /**
     * @param MediaInlineParser $mediaInlineParser
     * @param MediaInlineRenderer $mediaInlineRenderer
     */
    public function __construct(MediaInlineParser $mediaInlineParser, MediaInlineRenderer $mediaInlineRenderer)
    {
        $this->mediaInlineParser = $mediaInlineParser;
        $this->mediaInlineRenderer = $mediaInlineRenderer;
    }

    /**
     * @return array
     */
    public function getInlineParsers(): array
    {
        return [
            $this->mediaInlineParser,
        ];
    }

    /**
     * @return array
     */
    public function getInlineRenderers(): array
    {
        return [
            MediaInline::class => $this->mediaInlineRenderer,
        ];
    }
}
