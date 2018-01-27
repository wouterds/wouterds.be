<?php

namespace WouterDeSchuyter\Domain\Commands\Sitemap;

class GenerateSitemap
{
    /**
     * @var bool
     */
    private $pingSearchEngines;

    /**
     * @param bool $pingSearchEngines
     */
    public function __construct(bool $pingSearchEngines)
    {
        $this->pingSearchEngines = $pingSearchEngines;
    }

    /**
     * @return bool
     */
    public function getPingSearchEngines(): bool
    {
        return $this->pingSearchEngines;
    }
}
