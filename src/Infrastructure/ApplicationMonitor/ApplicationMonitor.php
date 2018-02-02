<?php

namespace WouterDeSchuyter\Infrastructure\ApplicationMonitor;

use WouterDeSchuyter\Domain\ApplicationReport\ApplicationReport;
use WouterDeSchuyter\Infrastructure\Database\SQLLogger;

class ApplicationMonitor
{
    /**
     * @var int
     */
    private $bootTime;

    /**
     * @var SQLLogger
     */
    private $sqlLogger;

    public function __construct()
    {
        $this->bootTime = microtime(true);
    }

    /**
     * @return ApplicationReport
     */
    public function getReport(): ApplicationReport
    {
        return new ApplicationReport($this->bootTime, $this->sqlLogger);
    }

    /**
     * @param int $bootTime
     */
    public function setBootTime(int $bootTime)
    {
        $this->bootTime = $bootTime;
    }

    /**
     * @param SQLLogger $sqlLogger
     */
    public function setSqlLogger(SQLLogger $sqlLogger)
    {
        $this->sqlLogger = $sqlLogger;
    }
}
