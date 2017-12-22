<?php

namespace WouterDeSchuyter\Application\Http\Handlers;

use WouterDeSchuyter\Infrastructure\View\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\ViewAwareTrait;

class ContactHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/contact.html.twig';
    }
}
