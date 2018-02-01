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
            return $this->renderImage($media, $inline->isAmpEnabled());
        }

        if ($media->isYoutubeVideo()) {
            return $this->renderYoutubeVideo($media);
        }

        if ($media->isVimeoVideo()) {
            return $this->renderVimeoVideo($media, $inline->isAmpEnabled());
        }

        return '';
    }

    /**
     * @param Media $image
     * @param bool $ampEnabled
     * @return string
     */
    private function renderImage(Media $image, $ampEnabled = false)
    {
        $html = '';

        // Span wrapper - start
        $html .= '<span ';
        $html .= 'class="media media--image' . ($ampEnabled ? ' media--amp' : '') . '" ';
        if (!$ampEnabled) {
            $html .= 'style="padding-bottom: ' . $image->getRatio() .'%"';
        }
        $html .= '>';

        // Image
        $html .= $ampEnabled ? '<amp-img' : '<img';
        if (!$ampEnabled) {
            $html .= ' class="media__image"';
        }
        $html .= ' src="/static/media' . $image->getPath() . '"';
        $html .= ' alt="' . htmlentities($image->getName()) . '"';
        $html .= ' title="' . htmlentities($image->getName()) . '"';
        if ($ampEnabled) {
            $html .= ' width="' . $image->getWidth() . '"';
            $html .= ' height="' . $image->getHeight() . '"';
            $html .= ' layout="responsive"';
        }
        $html .= '>';
        if ($ampEnabled) {
            $html .= '</amp-img>';
        }

        // Span wrapper - end
        $html .= '</span>';

        return $html;
    }

    /**
     * @param Media $youtubeVideo
     * @return string
     */
    private function renderYoutubeVideo(Media $youtubeVideo)
    {
        $embedUrl = explode('.be/', $youtubeVideo->getUrl());
        $embedUrl = 'https://youtube.com/embed/' . end($embedUrl);

        $html = '';
        // Span wrapper - start
        $html .= '<span ';
        $html .= 'class="media media--youtube-video" ';
        $html .= 'style="padding-bottom: ' . $youtubeVideo->getRatio() .'%"';
        $html .= '>';

        // Image
        $html .= '<iframe ';
        $html .= 'class="media__video" ';
        $html .= 'src="' . $embedUrl . '" ';
        $html .= 'frameborder="0" ';
        $html .= 'allowfullscreen>';
        $html .= $youtubeVideo->getUrl();
        $html .= '</iframe>';

        // Span wrapper - end
        $html .= '</span>';

        return $html;
    }

    /**
     * @param Media $vimeoVideo
     * @param bool $ampEnabled
     * @return string
     */
    private function renderVimeoVideo(Media $vimeoVideo, $ampEnabled = false)
    {
        $vimeoVideoId = explode('.com/', $vimeoVideo->getUrl())[1];
        $embedUrl = 'https://player.vimeo.com/video/' . $vimeoVideoId;

        $html = '';
        // Span wrapper - start
        $html .= '<span';
        $html .= ' class="media media--vimeo-video' . ($ampEnabled ? ' media--amp' : '') . '"';
        if (!$ampEnabled) {
            $html .= ' style="padding-bottom: ' . $vimeoVideo->getRatio() . '%"';
        }
        $html .= '>';

        // Video
        if (!$ampEnabled) {
            $html .= '<iframe ';
            $html .= 'class="media__video" ';
            $html .= 'src="' . $embedUrl . '" ';
            $html .= 'frameborder="0" ';
            $html .= 'allowfullscreen>';
            $html .= $vimeoVideo->getUrl();
            $html .= '</iframe>';
        } else {
            $html .= '<amp-vimeo';
            $html .= ' data-videoid="' . $vimeoVideoId . '"';
            $html .= ' layout="responsive"';
            $html .= ' width="' . $vimeoVideo->getWidth() . '"';
            $html .= ' height="' . $vimeoVideo->getHeight() . '"';
            $html .= '>';
            $html .= '</amp-vimeo>';
        }

        // Span wrapper - end
        $html .= '</span>';

        return $html;
    }
}
