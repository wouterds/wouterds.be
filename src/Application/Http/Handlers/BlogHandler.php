<?php

namespace WouterDeSchuyter\Application\Http\Handlers;

use WouterDeSchuyter\Infrastructure\View\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\ViewAwareTrait;

class BlogHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/blog.html.twig';
    }
}
