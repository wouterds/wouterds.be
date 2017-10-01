<?php

namespace Wouterds\Application\Http\Handlers\Admin;

use Wouterds\Application\Http\Handlers\ViewHandler;

class AdminSignUpHandler extends ViewHandler
{
    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return '/admin/sign-up.html.twig';
    }
}
