<?php

namespace WouterDeSchuyter\Application\Commands\AccessLogs;

use Kassner\LogParser\FormatException;
use Kassner\LogParser\LogParser;
use WouterDeSchuyter\Domain\AccessLogs\AccessLog;
use WouterDeSchuyter\Domain\AccessLogs\AccessLogRepository;
use WouterDeSchuyter\Domain\Commands\AccessLogs\ImportAccessLogs;
use WouterDeSchuyter\Infrastructure\ValueObjects\DateTime;

class ImportAccessLogsHandler
{
    /**
     * @var AccessLogRepository
     */
    private $accessLogRepository;

    /**
     * @param AccessLogRepository $accessLogRepository
     */
    public function __construct(AccessLogRepository $accessLogRepository)
    {
        $this->accessLogRepository = $accessLogRepository;
    }

    /**
     * @param ImportAccessLogs $importAccessLogs
     */
    public function handle(ImportAccessLogs $importAccessLogs)
    {
        $logFile = APP_DIR . '/storage/logs/nginx/access.log';

        // No logs yet?
        if (!file_exists($logFile)) {
            return;
        }

        // Create log parser
        $logParser = new LogParser();

        // Nginx log format
        $logParser->setFormat('%h %l %u %t "%r" %>s %O "%{Referer}i" \"%{User-Agent}i"');

        // Get data
        $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        // Save data to db
        foreach ($lines as $line) {
            try {
                $entry = $logParser->parse($line);
            } catch (FormatException $e) {
                continue;
            }

            // Get required data from entry
            $ip = $entry->host;
            $statusCode = (int) $entry->status;
            list($requestMethod, $requestPath) = explode(' ', $entry->request);
            $userAgent = $entry->HeaderUserAgent;
            $timestamp = DateTime::fromTimestamp($entry->stamp);

            $this->accessLogRepository->add(new AccessLog(
                $requestMethod,
                $requestPath,
                $statusCode,
                $ip,
                $userAgent,
                $timestamp
            ));
        }

        // Empty log
        file_put_contents($logFile, '');
    }
}
