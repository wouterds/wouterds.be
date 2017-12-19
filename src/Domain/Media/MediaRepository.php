<?php

namespace WouterDeSchuyter\Domain\Media;

interface MediaRepository
{
    /**
     * @param Media $media
     */
    public function add(Media $media);

    /**
     * @return Media[]
     */
    public function findAll(): array;

    /**
     * @param MediaId $id
     * @return Media|null
     */
    public function find(MediaId $id): ?Media;
}
