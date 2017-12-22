<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Blog;

use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareTrait;

class IndexHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/admin/blog/index.html.twig';
    }
}
