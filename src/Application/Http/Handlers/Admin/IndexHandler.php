<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin;

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
        return 'pages/admin/index.html.twig';
    }
}
