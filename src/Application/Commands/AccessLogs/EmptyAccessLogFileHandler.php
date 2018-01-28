<?php

namespace WouterDeSchuyter\Application\Commands\AccessLogs;

use WouterDeSchuyter\Domain\Commands\AccessLogs\EmptyAccessLogFile;

class EmptyAccessLogFileHandler
{
    /**
     * @param EmptyAccessLogFile $emptyAccessLogFile
     */
    public function handle(EmptyAccessLogFile $emptyAccessLogFile)
    {
        if (!file_exists($emptyAccessLogFile->getLogFile())) {
            return;
        }

        // Empty log
        file_put_contents($emptyAccessLogFile->getLogFile(), '');
    }
}
