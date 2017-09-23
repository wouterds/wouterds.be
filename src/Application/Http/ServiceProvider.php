<?php

namespace Wouterds\Application\Http;

use Slim\Settings;
use Jenssegers\Lean\SlimServiceProvider;

class ServiceProvider extends SlimServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function register()
    {
        parent::register();

        $this->container->share('settings', function() {
            $settings = $this->defaultSettings;
            $settings['displayErrorDetails'] = in_array(getenv('APP_ENV'), ['local', 'staging']);

            return $settings;
        });
    }
}
