<?php

namespace Wouterds\Application\Http\Handlers;

class HomeHandler
{
    public function __invoke()
    {
        echo 'Hello World!';
    }
}
