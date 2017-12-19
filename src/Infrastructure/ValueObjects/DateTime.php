<?php

namespace WouterDeSchuyter\Infrastructure\ValueObjects;

class DateTime extends \DateTime
{
    const DATETIME = 'Y-m-d H:i:s';

    /**
     * @return string
     */
    public function __toString()
    {
        return self::format(self::DATETIME);
    }
}
