<?php

namespace Wouterds\Application\Http\Handlers;

class HomeHandler
{
    /**
     * Home request handler
     */
    public function __invoke()
    {
        echo 'Hello World!';
    }
}
