<?php

namespace WouterDeSchuyter\Infrastructure\View;

use WouterDeSchuyter\Domain\Media\MediaId;
use WouterDeSchuyter\Domain\Media\MediaRepository;

class MediaRenderer
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
     * @param string $contents
     * @return string
     */
    public function process(string $contents): string
    {
        preg_match_all('/media\(.+?\)/', $contents, $matches);

        $map = [];
        foreach ($matches[0] as $placeholder) {
            $id = str_replace(['media(', ')'], null, $placeholder);
            $map[$id] = $placeholder;
        }

        $mediaIds = array_map(function ($mediaId) {
            return new MediaId($mediaId);
        }, array_keys($map));

        $media = $this->mediaRepository->findMultiple($mediaIds);

        foreach ($map as $id => $placeholder) {
            $mediaItem = $media[$id];

            $replacement = '';
            if ($mediaItem->isImage()) {
                $replacement = '<span class="media media--image" style="padding-bottom: ' . $mediaItem->getRatio() .'%">';
                $replacement .= '<img class="media__image" src="/static/media' . $mediaItem->getPath() . '" alt="' . htmlentities($mediaItem->getName()) . '" title="' . htmlentities($mediaItem->getName()) . '">';
                $replacement .= '</span>';
            }

            $contents = str_replace($placeholder, $replacement, $contents);
        }

        return $contents;
    }
}
