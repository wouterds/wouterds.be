<?php

namespace WouterDeSchuyter\Application\Console\Commands;

use samdark\sitemap\Sitemap;
use Slim\Router;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Infrastructure\Config\Config;

class GenerateRobots extends Command
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

        parent::__construct(get_class($this));
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|null|void
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $contents = '';
        $contents .= $this->getAsciHeader() . PHP_EOL;
        $contents .= $this->getRules() . PHP_EOL;
        $contents .= $this->getSitemap() . PHP_EOL;

        file_put_contents(APP_DIR . '/public/robots.txt', $contents);
    }

    /**
     * @return string
     */
    private function getSitemap(): string
    {
        $line = '';
        $line .= 'Sitemap: ' . $this->config->get('APP_URL') . '/sitemap.xml' . PHP_EOL;

        return $line;
    }

    /**
     * @return string
     */
    private function getRules(): string
    {
        $line = '';
        $line .= 'User-Agent: *' . PHP_EOL;
        $line .= 'Allow: /' . PHP_EOL;
        $line .= 'Disallow: /admin' . PHP_EOL;
        $line .= 'Disallow: /admin/*' . PHP_EOL;
        $line .= 'Disallow: /404' . PHP_EOL;

        return $line;
    }

    /**
     * @return string
     */
    private function getAsciHeader(): string
    {
        $line = '';
        $line .= '#                      _               _                _                 _            _';
        $line .= PHP_EOL;
        $line .= '#                     | |             | |              | |               | |          | |';
        $line .= PHP_EOL;
        $line .= '# __      _____  _   _| |_ ___ _ __ __| | ___  ___  ___| |__  _   _ _   _| |_ ___ _ __| |__   ___';
        $line .= PHP_EOL;
        $line .= '# \ \ /\ / / _ \| | | | __/ _ \ \'__/ _` |/ _ \/ __|/ __| \'_ \| | | | | | | __/ _ \ \'__| \'_ \ / _';
        $line .= ' \\';
        $line .= PHP_EOL;
        $line .= '#  \ V  V / (_) | |_| | ||  __/ | | (_| |  __/\__ \ (__| | | | |_| | |_| | ||  __/ | _| |_) |  __/';
        $line .= PHP_EOL;
        $line .= '#   \_/\_/ \___/ \__,_|\__\___|_|  \__,_|\___||___/\___|_| |_|\__,_|\__, |\__\___|_|(_)_.__/ \___|';
        $line .= PHP_EOL;
        $line .= '#                                               __/ |';
        $line .= PHP_EOL;
        $line .= '#                                              |___/';
        $line .= PHP_EOL;
        $line .= '#';
        $line .= PHP_EOL;
        $line .= '# v' . $this->config->get('APP_VERSION_NUMBER') . ' - ' . $this->config->get('APP_VERSION_COMMIT');
        $line .= PHP_EOL;
        $line .= '#';
        $line .= PHP_EOL;
        $line .= '# robots.txt';
        $line .= PHP_EOL;
        $line .= '#';
        $line .= PHP_EOL;

        return $line;
    }
}
