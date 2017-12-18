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
            'name' => $media->getName(),
            'content_type' => $media->getContentType(),
            'size' => $media->getSize(),
            'md5' => $media->getMd5(),
        ]);
    }

    /**
     * @param MediaId $id
     * @return Media|null
     */
    public function find(MediaId $id): ?Media
    {
        $query = $this->connection->createQueryBuilder();
        $query->select('*');
        $query->from(self::TABLE);
        $query->where('id = ' . $query->createNamedParameter($id));
        $query->andWhere('deleted_at IS NULL');
        $result = $query->execute()->fetch();

        if (empty($result)) {
            return null;
        }

        return Media::fromArray($result);
    }
}
