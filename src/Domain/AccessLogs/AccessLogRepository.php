<?php

namespace WouterDeSchuyter\Domain\AccessLogs;

interface AccessLogRepository
{
    /**
     * @param AccessLog $accessLog
     */
    public function add(AccessLog $accessLog);

    /**
     * @return array
     */
    public function responseCodesPerHourLastDay(): array;

    /**
     * @return array
     */
    public function responseCountPerHourLast7Days(): array;

    /**
     * @param int $days
     * @return int
     */
    public function visitsLast(int $days): int;

    /**
     * @param int $days
     * @return int
     */
    public function uniqueVisitsLast(int $days): int;

    /**
     * @param int $days
     * @return int
     */
    public function uniqueCountriesLast(int $days): int;
}
