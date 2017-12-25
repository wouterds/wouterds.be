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

    /**
     * @param MediaId[] $mediaIds
     * @return Media[]
     */
    public function findMultiple(array $mediaIds): array;

    /**
     * @param MediaId $id
     */
    public function delete(MediaId $id);
}
