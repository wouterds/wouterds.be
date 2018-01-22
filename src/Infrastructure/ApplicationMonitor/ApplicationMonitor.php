<?php

namespace WouterDeSchuyter\Infrastructure\ApplicationMonitor;

use WouterDeSchuyter\Domain\ApplicationReport\ApplicationReport;

class ApplicationMonitor
{
    /**
     * @var int
     */
    private $bootTime;

    public function __construct()
    {
        $this->bootTime = microtime(true);
    }

    /**
     * @return ApplicationReport
     */
    public function getReport(): ApplicationReport
    {
        $elapsedTime = ceil((microtime(true) - $this->bootTime) * 1000);
        $memoryUsed = memory_get_peak_usage();

        return new ApplicationReport($elapsedTime, $memoryUsed);
    }

    /**
     * @param int $bootTime
     */
    public function setBootTime(int $bootTime)
    {
        $this->bootTime = $bootTime;
    }
}
