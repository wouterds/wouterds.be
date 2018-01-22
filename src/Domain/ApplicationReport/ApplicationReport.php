<?php

namespace WouterDeSchuyter\Domain\ApplicationReport;

class ApplicationReport
{
    /**
     * @var ElapsedTime
     */
    private $elapsedTime;

    /**
     * @var UsedMemory
     */
    private $usedMemory;

    /**
     * @var int
     */
    private $queryCount;

    /**
     * @param int $elapsedTime
     * @param int $usedMemory
     * @param int $queryCount
     */
    public function __construct(int $elapsedTime, int $usedMemory, int $queryCount)
    {
        $this->elapsedTime = new ElapsedTime($elapsedTime);
        $this->usedMemory = new UsedMemory($usedMemory);
        $this->queryCount = $queryCount;
    }

    /**
     * @return ElapsedTime
     */
    public function getElapsedTime(): ElapsedTime
    {
        return $this->elapsedTime;
    }

    /**
     * @return UsedMemory
     */
    public function getUsedMemory(): UsedMemory
    {
        return $this->usedMemory;
    }

    /**
     * @return int
     */
    public function getQueryCount(): int
    {
        return $this->queryCount;
    }
}
