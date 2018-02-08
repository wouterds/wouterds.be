<?php

namespace WouterDeSchuyter\Application\Http\Handlers;

use WouterDeSchuyter\Application\Http\Handlers\Blog\IndexHandler as BlogIndexHandler;
use WouterDeSchuyter\Infrastructure\View\ViewAwareInterface;

class HomeHandler extends BlogIndexHandler implements ViewAwareInterface
{
    /**
     * @return null|string
     */
    public function getAmpStylesheet(): ?string
    {
        return 'home.css';
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/home.html.twig';
    }
}
