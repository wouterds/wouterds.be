<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Users;

use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareTrait;

class SignInHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/admin/users/sign-in.html.twig';
    }
}
