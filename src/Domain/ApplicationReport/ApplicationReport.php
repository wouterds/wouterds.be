<?php

namespace WouterDeSchuyter\Domain\ApplicationReport;

use WouterDeSchuyter\Infrastructure\Database\SQLLogger;

class ApplicationReport
{
    /**
     * @var int
     */
    private $bootTime;

    /**
     * @var SQLLogger
     */
    private $sqlLogger;

    /**
     * @param int $bootTime
     * @param SQLLogger $sqlLogger
     */
    public function __construct(int $bootTime, SQLLogger $sqlLogger)
    {
        $this->bootTime = $bootTime;
        $this->sqlLogger = $sqlLogger;
    }

    /**
     * @return ElapsedTime
     */
    public function getElapsedTime(): ElapsedTime
    {
        return new ElapsedTime(ceil((microtime(true) - $this->bootTime) * 1000));
    }

    /**
     * @return UsedMemory
     */
    public function getUsedMemory(): UsedMemory
    {
        return new UsedMemory(memory_get_peak_usage());
    }

    /**
     * @return int
     */
    public function getQueryCount(): int
    {
        return $this->sqlLogger->getQueryCount();
    }
}
