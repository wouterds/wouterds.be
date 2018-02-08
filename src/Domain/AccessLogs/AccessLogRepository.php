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
     * @return int
     */
    public function visitsLastDay(): int;

    /**
     * @return int
     */
    public function uniqueVisitsLastDay(): int;

    /**
     * @return int
     */
    public function uniqueCountriesLastDay(): int;
}
