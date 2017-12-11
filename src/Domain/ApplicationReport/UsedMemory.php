<?php

namespace WouterDeSchuyter\Domain\ApplicationReport;

class UsedMemory
{
    /**
     * @var int
     */
    private $value;

    /**
     * @param int $value
     */
    public function __construct(int $value)
    {
        $this->value = $value;
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return (string) $this->value;
    }

    /**
     * @return int
     */
    public function getValue(): int
    {
        return $this->value;
    }

    /**
     * @return string
     */
    public function inKB(): string
    {
        return round($this->value / 1000, 0);
    }

    /**
     * @return string
     */
    public function inMB(): string
    {
        return round($this->value / 1000000, 2);
    }
}
