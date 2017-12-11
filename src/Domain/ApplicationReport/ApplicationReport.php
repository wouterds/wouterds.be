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
     * @param int $elapsedTime
     * @param int $usedMemory
     */
    public function __construct(int $elapsedTime, int $usedMemory)
    {
        $this->elapsedTime = new ElapsedTime($elapsedTime);
        $this->usedMemory = new UsedMemory($usedMemory);
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
}
