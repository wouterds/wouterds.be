<?php

namespace WouterDeSchuyter\Infrastructure\View\Markdown\Extensions;

use League\CommonMark\ElementRendererInterface;
use League\CommonMark\HtmlElement;
use League\CommonMark\Inline\Element\AbstractInline;
use League\CommonMark\Inline\Renderer\InlineRendererInterface;
use WouterDeSchuyter\Domain\Media\Media;
use WouterDeSchuyter\Domain\Media\MediaRepository;

class MediaInlineRenderer implements InlineRendererInterface
{
    /**
     * @var MediaRepository
     */
    private $mediaRepository;

    /**
     * @param MediaRepository $mediaRepository
     */
    public function __construct(MediaRepository $mediaRepository)
    {
        $this->mediaRepository = $mediaRepository;
    }

    /**
     * @param AbstractInline|MediaInline $inline
     * @param ElementRendererInterface $htmlRenderer
     * @return HtmlElement|string
     */
    public function render(AbstractInline $inline, ElementRendererInterface $htmlRenderer)
    {
        $media = $this->mediaRepository->find($inline->getMediaId());

        if (empty($media)) {
            return '';
        }

        if ($media->isImage()) {
            return $this->renderImage($media);
        }

        return '';
    }

    /**
     * @param Media $image
     * @return string
     */
    private function renderImage(Media $image)
    {
        $html = '';

        // Span wrapper - start
        $html .= '<span ';
        $html .= 'class="media media--image" ';
        $html .= 'style="padding-bottom: ' . $image->getRatio() .'%"';
        $html .= '>';

        // Image
        $html .= '<img ';
        $html .= 'class="media__image" ';
        $html .= 'src="/static/media' . $image->getPath() . '" ';
        $html .= 'alt="' . htmlentities($image->getName()) . '" ';
        $html .= 'title="' . htmlentities($image->getName()) . '"';
        $html .= '>';

        // Span wrapper - end
        $html .= '</span>';

        return $html;
    }
}
