<?php

namespace WouterDeSchuyter\Application\Commands\Sitemap;

use WouterDeSchuyter\Domain\Commands\Sitemap\PingSearchEngines;
use WouterDeSchuyter\Infrastructure\Config\Config;

class PingSearchEnginesHandler
{
    /**
     * @var Config
     */
    private $config;

    /**
     * @param Config $config
     */
    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    /**
     * @param PingSearchEngines $pingSearchEngines
     */
    public function handle(PingSearchEngines $pingSearchEngines)
    {
        $sitemapUrl = urlencode($this->config->get('APP_URL') . '/sitemap.xml');

        $searchEnginePingUrls = [
            "https://www.google.com/webmasters/sitemaps/ping?sitemap={$sitemapUrl}",
            "https://www.bing.com/ping?sitemap={$sitemapUrl}",
        ];

        foreach ($searchEnginePingUrls as $searchEnginePingUrl) {
            self::ping($searchEnginePingUrl);
        }
    }

    /**
     * @param string $url
     * @return int
     */
    private static function ping(string $url): int
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $statusCode;
    }
}
