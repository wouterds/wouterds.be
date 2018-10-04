<?php

namespace WouterDeSchuyter\Infrastructure\View\Admin;

use Slim\Http\Response;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Infrastructure\View\ViewAwareTrait as BaseViewAwareTrait;

trait ViewAwareTrait
{
    use BaseViewAwareTrait {
        render as baseRender;
    }

    /**
     * @var AuthenticatedUser
     */
    private $authenticatedUser;

    /**
     * @param AuthenticatedUser $authenticatedUser
     */
    public function setAuthenticatedUser(AuthenticatedUser $authenticatedUser): void
    {
        $this->authenticatedUser = $authenticatedUser;
    }

    /**
     * @param Response $response
     * @param array $data
     * @return Response
     */
    public function render(Response $response, array $data = []): Response
    {
        if (empty($data['footer'])) {
            $data['footer'] = [];
        }

        $data['footer']['admin'] = true;

        if (empty($data['header'])) {
            $data['header'] = [];
        }

        $data['header']['admin'] = true;

        if ($this->authenticatedUser->isLoggedIn()) {
            $data['user'] = [
                'id'    => $this->authenticatedUser->getUser()->getId(),
                'name'  => $this->authenticatedUser->getUser()->getName(),
                'email' => $this->authenticatedUser->getUser()->getEmail(),
            ];
        }

        return $this->baseRender($response, $data);
    }
}
