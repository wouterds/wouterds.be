<?php

namespace WouterDeSchuyter\Infrastructure\Database;

use Exception;

class Query
{
    /**
     * @var string
     */
    private $query;

    /**
     * @var array
     */
    private $params;

    /**
     * @var array
     */
    private $types;

    /**
     * @var int
     */
    private $startTime;

    /**
     * @var int
     */
    private $endTime;

    /**
     * @param string $query
     * @param array $params
     * @param array $types
     */
    public function __construct(string $query, array $params, array $types)
    {
        $this->query = $query;
        $this->params = $params;
        $this->types = $types;
        $this->startTime = microtime();
    }

    public function markAsFinished()
    {
        if (!empty($this->endTime)) {
            throw new Exception('Query already marked as finished!');
        }

        $this->endTime = microtime();
    }

    /**
     * @return int
     */
    public function getElapsedTime(): int
    {
        return ($this->endTime - $this->startTime);
    }

    /**
     * @return float
     */
    public function getElapsedTimeInSeconds(): float
    {
        return $this->getElapsedTime() / 1000 / 1000;
    }
}
