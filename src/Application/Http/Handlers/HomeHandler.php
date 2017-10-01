<?php

namespace Wouterds\Application\Http\Handlers;

use Slim\Http\Request;
use Slim\Http\Response;

class HomeHandler extends ViewHandler
{
    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return '/home.html.twig';
    }
}
