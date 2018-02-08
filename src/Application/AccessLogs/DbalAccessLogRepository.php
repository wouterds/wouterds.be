<?php

namespace WouterDeSchuyter\Application\AccessLogs;

use Doctrine\DBAL\Connection;
use WouterDeSchuyter\Domain\AccessLogs\AccessLog;
use WouterDeSchuyter\Domain\AccessLogs\AccessLogRepository;

class DbalAccessLogRepository implements AccessLogRepository
{
    public const TABLE = 'access_log';

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
     * @param AccessLog $accessLog
     */
    public function add(AccessLog $accessLog)
    {
        $this->connection->insert(self::TABLE, [
            'id' => $accessLog->getId(),
            'method' => $accessLog->getMethod(),
            'path' => $accessLog->getPath(),
            'status_code' => $accessLog->getStatusCode(),
            'cf_ray_id' => $accessLog->getCfRayId(),
            'ip' => $accessLog->getIp(),
            'connecting_ip' => $accessLog->getConnectingIp(),
            'connecting_country' => $accessLog->getConnectingCountry(),
            'user_agent' => $accessLog->getUserAgent(),
            'timestamp' => $accessLog->getTimestamp(),
        ]);
    }

    /**
     * Get counts grouped per day
     *
     * @return array
     */
    public function responseCodesPerHourLastDay(): array
    {
        $query = $this->connection->createQueryBuilder();
        $query->from(self::TABLE);
        $query->select('`status_code`, COUNT(1) AS `count`, DATE_FORMAT(`timestamp`, "%H") as `hour`');
        $query->where('`timestamp` > DATE_SUB(NOW(), INTERVAL 24 HOUR)');
        $query->groupBy('`status_code`', '`hour`');

        return $query->execute()->fetchAll();
    }

    /**
     * @return array
     */
    public function responseCountPerHourLast7Days(): array
    {
        $query = $this->connection->createQueryBuilder();
        $query->from(self::TABLE);
        $query->select('COUNT(1) AS `count`, DATE_FORMAT(`timestamp`, "%y-%m-%d %H") as `interval`');
        $query->where('`timestamp` > DATE_SUB(NOW(), INTERVAL 7 DAY)');
        $query->groupBy('`interval`');

        return $query->execute()->fetchAll();
    }

    /**
     * @param int $days
     * @return int
     */
    public function visitsLast(int $days): int
    {
        $query = $this->connection->createQueryBuilder();
        $query->from(self::TABLE);
        $query->select('COUNT(1)');
        $query->where('`timestamp` > DATE_SUB(NOW(), INTERVAL ' . $query->createNamedParameter($days) .' DAY)');
        $query->andWhere('`method` = "GET"');
        $query->andWhere('`path` NOT LIKE "/static/%"');
        $query->andWhere('`path` NOT LIKE "/robots.txt%"');
        $query->andWhere('`path` NOT LIKE "/favicon.ico%"');
        $query->andWhere('`path` NOT LIKE "/apple-touch-icon%"');

        return $query->execute()->fetchColumn();
    }

    /**
     * @param int $days
     * @return int
     */
    public function uniqueVisitsLast(int $days): int
    {
        $query = $this->connection->createQueryBuilder();
        $query->from(self::TABLE);
        $query->select('COUNT(DISTINCT(`connecting_ip`))');
        $query->where('`timestamp` > DATE_SUB(NOW(), INTERVAL ' . $query->createNamedParameter($days) .' DAY)');
        $query->andWhere('`method` = "GET"');
        $query->andWhere('`path` NOT LIKE "/static/%"');
        $query->andWhere('`path` NOT LIKE "/robots.txt%"');
        $query->andWhere('`path` NOT LIKE "/favicon.ico%"');
        $query->andWhere('`path` NOT LIKE "/apple-touch-icon%"');

        return $query->execute()->fetchColumn();
    }

    /**
     * @param int $days
     * @return int
     */
    public function uniqueCountriesLast(int $days): int
    {
        $query = $this->connection->createQueryBuilder();
        $query->from(self::TABLE);
        $query->select('COUNT(DISTINCT(`connecting_country`))');
        $query->where('`timestamp` > DATE_SUB(NOW(), INTERVAL ' . $query->createNamedParameter($days) .' DAY)');
        $query->andWhere('`method` = "GET"');
        $query->andWhere('`path` NOT LIKE "/static/%"');
        $query->andWhere('`path` NOT LIKE "/robots.txt%"');
        $query->andWhere('`path` NOT LIKE "/favicon.ico%"');
        $query->andWhere('`path` NOT LIKE "/apple-touch-icon%"');

        return $query->execute()->fetchColumn();
    }
}
