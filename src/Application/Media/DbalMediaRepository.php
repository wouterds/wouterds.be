<?php

namespace WouterDeSchuyter\Application\Media;

use Doctrine\DBAL\Connection;
use WouterDeSchuyter\Domain\Media\Media;
use WouterDeSchuyter\Domain\Media\MediaId;
use WouterDeSchuyter\Domain\Media\MediaRepository;

class DbalMediaRepository implements MediaRepository
{
    public const TABLE = 'media';

    /**
     * @var Connection
     */
    private $connection;

    /**
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    /**
     * @param Media $media
     */
    public function add(Media $media)
    {
        $this->connection->insert(self::TABLE, [
            'id' => $media->getId(),
            'user_id' => $media->getUserId(),
            'name' => $media->getName(),
            'content_type' => $media->getContentType(),
            'size' => $media->getSize(),
            'width' => $media->getWidth(),
            'height' => $media->getHeight(),
            'md5' => $media->getMd5(),
        ]);
    }

    /**
     * @return Media[]
     */
    public function findAll(): array
    {
        $query = $this->connection->createQueryBuilder();
        $query->select('*');
        $query->from(self::TABLE);
        $query->where('deleted_at IS NULL');
        $query->orderBy('created_at', 'DESC');
        $rows = $query->execute()->fetchAll();

        if (empty($rows)) {
            return [];
        }

        $data = [];
        foreach ($rows as $row) {
            $media = Media::fromArray($row);

            $data[$media->getId()->getValue()] = $media;
        }

        return $data;
    }


    /**
     * @param MediaId[] $ids
     * @return Media[]
     */
    public function findMultiple(array $ids): array
    {
        $query = $this->connection->createQueryBuilder();
        $query->select('*');
        $query->from(self::TABLE);
        $query->where('id IN (' . $query->createNamedParameter($ids, Connection::PARAM_STR_ARRAY) . ')');
        $query->andWhere('deleted_at IS NULL');
        $query->orderBy('created_at', 'DESC');
        $rows = $query->execute()->fetchAll();

        if (empty($rows)) {
            return [];
        }

        $data = [];
        foreach ($rows as $row) {
            $media = Media::fromArray($row);

            $data[$media->getId()->getValue()] = $media;
        }

        return $data;
    }

    /**
     * @param MediaId $id
     * @return null|Media
     */
    public function find(MediaId $id): ?Media
    {
        $media = $this->findMultiple([$id]);

        if (empty($media)) {
            return null;
        }

        return reset($media);
    }

    /**
     * @param MediaId $id
     */
    public function delete(MediaId $id)
    {
        $query = $this->connection->createQueryBuilder();
        $query->update(self::TABLE);
        $query->set('updated_at', 'NOW()');
        $query->set('deleted_at', 'NOW()');
        $query->where('id = ' . $query->createNamedParameter($id));
        $query->execute();
    }
}
