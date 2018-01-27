<?php

namespace WouterDeSchuyter\Domain\AccessLogs;

interface AccessLogRepository
{
    /**
     * @param AccessLog $accessLog
     */
    public function add(AccessLog $accessLog);
}
