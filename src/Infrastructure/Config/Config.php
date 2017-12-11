<?php

namespace WouterDeSchuyter\Infrastructure\Config;

class Config
{
    /**
     * @var array
     */
    private $values;

    /**
     * @param array $values
     */
    public function __construct(array $values)
    {
        $this->values = $values;
    }

    /**
     * @param string $key
     * @return mixed|null
     */
    public function get(string $key)
    {
        if (empty($this->values[$key])) {
            return null;
        }

        return $this->values[$key];
    }
}
