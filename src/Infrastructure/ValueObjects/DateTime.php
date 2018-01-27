<?php

namespace WouterDeSchuyter\Infrastructure\ValueObjects;

class DateTime extends \DateTime
{
    const DATETIME = 'Y-m-d H:i:s';

    /**
     * @param int $timestamp
     * @return DateTime
     */
    public static function fromTimestamp(int $timestamp): self
    {
        return new self(date(DateTime::DATETIME, $timestamp));
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return self::format(self::DATETIME);
    }
}
