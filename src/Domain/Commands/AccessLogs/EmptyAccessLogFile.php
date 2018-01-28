<?php

namespace WouterDeSchuyter\Domain\Commands\AccessLogs;

class EmptyAccessLogFile
{
    /**
     * @var string
     */
    private $logFile;

    /**
     * @param string $logFile
     */
    public function __construct(string $logFile)
    {
        $this->logFile = $logFile;
    }

    /**
     * @return string
     */
    public function getLogFile(): string
    {
        return $this->logFile;
    }
}
