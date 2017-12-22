<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Users;

use Slim\Http\Request;
use Slim\Http\Response;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareTrait;

class IndexHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/admin/users/index.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $users = $this->userRepository->findAll();

        $data = [];
        $data['users'] = $users;

        return $this->render($response, $data);
    }
}
