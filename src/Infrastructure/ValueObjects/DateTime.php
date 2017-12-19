<?php

namespace WouterDeSchuyter\Infrastructure\ValueObjects;

class DateTime extends \DateTime
{
    /**
     * @return string
     */
    public function __toString()
    {
        return self::format(self::ATOM);
    }
}
