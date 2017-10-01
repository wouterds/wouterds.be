<?php

namespace Wouterds\Infrastructure\Config;

class Config
{
    const APP_ENV_LOCAL = 'local';
    const APP_ENV_STAGING = 'staging';
    const APP_ENV_PRODUCTION = 'production';

    /**
     * @var array
     */
    private $values;

    /**
     * @param array $values
     */
    public function __construct(array $values = [])
    {
        $this->values = array_merge($_ENV, $values);
    }

    /**
     * @return string
     */
    public function getEnv(): string
    {
        return $this->get('APP_ENV');
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
