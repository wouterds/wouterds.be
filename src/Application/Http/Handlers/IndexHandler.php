<?php

namespace WouterDeSchuyter\Application\Http\Handlers;

use WouterDeSchuyter\Application\Http\Handlers\Blog\IndexHandler as BlogIndexHandler;
use WouterDeSchuyter\Infrastructure\View\ViewAwareInterface;

class IndexHandler extends BlogIndexHandler implements ViewAwareInterface
{
    /**
     * @return null|string
     */
    public function getAmpStylesheet(): ?string
    {
        return 'index.css';
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/index.html.twig';
    }
}
