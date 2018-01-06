<?php

namespace WouterDeSchuyter\Application\Commands\Media;

use Exception;
use WouterDeSchuyter\Domain\Commands\Media\AddMedia;
use WouterDeSchuyter\Domain\Media\MediaBuilder;
use WouterDeSchuyter\Domain\Media\UnsupportedMediaException;
use WouterDeSchuyter\Domain\Media\MediaRepository;
use WouterDeSchuyter\Domain\Media\StoreMediaFailedException;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Infrastructure\Filesystem\Filesystem;
use WouterDeSchuyter\Infrastructure\Vimeo\Api as VimeoApi;
use WouterDeSchuyter\Infrastructure\YouTube\Api as YouTubeApi;

class AddMediaHandler
{
    private const ALLOWED_CONTENT_TYPES = [
        'image/jpeg',
    ];

    /**
     * @var AuthenticatedUser
     */
    private $authenticatedUser;

    /**
     * @var Filesystem
     */
    private $filesystem;

    /**
     * @var MediaRepository
     */
    private $mediaRepository;

    /**
     * @var YouTubeApi
     */
    private $youTubeApi;

    /**
     * @var VimeoApi
     */
    private $vimeoApi;

    /**
     * @param AuthenticatedUser $authenticatedUser
     * @param Filesystem $filesystem
     * @param MediaRepository $mediaRepository
     * @param YouTubeApi $youTubeApi
     * @param VimeoApi $vimeoApi
     */
    public function __construct(AuthenticatedUser $authenticatedUser, Filesystem $filesystem, MediaRepository $mediaRepository, YouTubeApi $youTubeApi, VimeoApi $vimeoApi)
    {
        $this->authenticatedUser = $authenticatedUser;
        $this->filesystem = $filesystem;
        $this->mediaRepository = $mediaRepository;
        $this->youTubeApi = $youTubeApi;
        $this->vimeoApi = $vimeoApi;
    }

    /**
     * @param AddMedia $addMedia
     * @throws UnsupportedMediaException
     * @throws StoreMediaFailedException
     */
    public function handle(AddMedia $addMedia)
    {
        if (!empty($addMedia->getUrl())) {
            $this->handleUrlMedia($addMedia);
            return;
        }

        $this->handleFileMedia($addMedia);
    }

    /**
     * @param AddMedia $addMedia
     * @throws UnsupportedMediaException
     * @throws StoreMediaFailedException
     */
    private function handleFileMedia(AddMedia $addMedia)
    {
        if (!in_array($addMedia->getUploadedFile()->getClientMediaType(), self::ALLOWED_CONTENT_TYPES)) {
            throw new UnsupportedMediaException();
        }

        $builder = MediaBuilder::startWithDefault()
            ->withUserId($this->authenticatedUser->getUser()->getId())
            ->withName($addMedia->getUploadedFile()->getClientFilename())
            ->withContentType($addMedia->getUploadedFile()->getClientMediaType())
            ->withSize($addMedia->getUploadedFile()->getSize());

        if (!empty($addMedia->getLabel())) {
            $builder = $builder->withName($addMedia->getLabel());
        }

        $media = $this->filesystem->store($builder->build(), $addMedia->getUploadedFile()->getStream());

        if (empty($media)) {
            throw new StoreMediaFailedException();
        }

        try {
            $this->mediaRepository->add($media);
        } catch (Exception $e) {
            $this->filesystem->remove($media);
            throw new StoreMediaFailedException();
        }
    }

    /**
     * @param AddMedia $addMedia
     * @throws UnsupportedMediaException
     */
    private function handleUrlMedia(AddMedia $addMedia)
    {
        if ($this->isYouTubeMedia($addMedia)) {
            $this->handleYouTubeMedia($addMedia);
            return;
        }

        if ($this->isVimeoMedia($addMedia)) {
            $this->handleVimeoMedia($addMedia);
            return;
        }

         throw new UnsupportedMediaException();
    }

    /**
     * @param AddMedia $addMedia
     * @return bool
     */
    private function isYouTubeMedia(AddMedia $addMedia): bool
    {
        $url = strtolower($addMedia->getUrl());
        $host = parse_url($url, PHP_URL_HOST);
        $host = str_replace('www.', null, $host);

        return in_array($host, ['youtube.com', 'youtu.be']);
    }

    /**
     * @param AddMedia $addMedia
     * @return bool
     */
    private function isVimeoMedia(AddMedia $addMedia): bool
    {
        $url = strtolower($addMedia->getUrl());
        $host = parse_url($url, PHP_URL_HOST);
        $host = str_replace('www.', null, $host);

        return in_array($host, ['vimeo.com']);
    }

    /**
     * @param AddMedia $addMedia
     * @throws UnsupportedMediaException
     */
    private function handleYouTubeMedia(AddMedia $addMedia)
    {
        $id = $this->parseYouTubeIdFromUrl($addMedia->getUrl());
        $meta = $this->youTubeApi->getVideoMeta($id);

        if (empty($meta)) {
            throw new UnsupportedMediaException();
        }

        $builder = MediaBuilder::startWithDefault()
            ->withUserId($this->authenticatedUser->getUser()->getId())
            ->withName($meta['snippet']['title'])
            ->withWidth(1280)
            ->withHeight(720)
            ->withUrl('https://youtu.be/' . $meta['id']);

        if (!empty($addMedia->getLabel())) {
            $builder = $builder->withName($addMedia->getLabel());
        }

        $media = $builder->build();

        $this->mediaRepository->add($media);
    }

    /**
     * @param AddMedia $addMedia
     * @throws UnsupportedMediaException
     */
    private function handleVimeoMedia(AddMedia $addMedia)
    {
        $id = $this->parseVimeoIdFromUrl($addMedia->getUrl());
        $meta = $this->vimeoApi->getVideoMeta($id);

        if (empty($meta)) {
            throw new UnsupportedMediaException();
        }

        $builder = MediaBuilder::startWithDefault()
            ->withUserId($this->authenticatedUser->getUser()->getId())
            ->withName($meta['name'])
            ->withWidth($meta['width'])
            ->withHeight($meta['height'])
            ->withUrl('https://vimeo.com/' . $id);

        if (!empty($addMedia->getLabel())) {
            $builder = $builder->withName($addMedia->getLabel());
        }

        $media = $builder->build();

        $this->mediaRepository->add($media);
    }

    /**
     * @param string $url
     * @return null|string
     */
    private function parseYouTubeIdFromUrl(string $url): ?string
    {
        $host = strtolower(parse_url($url, PHP_URL_HOST));
        $host = str_replace('www.', null, $host);

        $id = null;
        switch ($host) {
            case 'youtube.com':
                $queryParams = parse_url($url, PHP_URL_QUERY);
                $matches = [];
                preg_match('/v=([^&]+)&?/', $queryParams, $matches);

                if (!empty($matches[1])) {
                    $id = $matches[1];
                }
                break;

            case 'youtu.be':
                $parts = explode('/', $url);
                $id = end($parts);
                break;
        }

        return $id;
    }

    /**
     * @param string $url
     * @return null|string
     */
    private function parseVimeoIdFromUrl(string $url): ?string
    {
        $host = strtolower(parse_url($url, PHP_URL_HOST));
        $host = str_replace('www.', null, $host);

        $id = null;
        switch ($host) {
            case 'vimeo.com':
                $parts = explode('/', $url);
                $id = end($parts);
                break;
        }

        return $id;
    }
}
