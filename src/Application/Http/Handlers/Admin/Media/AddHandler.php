<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Media;

use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareTrait;

class AddHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/admin/media/add.html.twig';
    }
}
