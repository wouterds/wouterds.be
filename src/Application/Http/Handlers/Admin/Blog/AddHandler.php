<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Blog;

use DateTimeZone;
use Slim\Http\Request;
use Slim\Http\Response;
use WouterDeSchuyter\Domain\Media\MediaRepository;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Infrastructure\ValueObjects\DateTime;
use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareTrait;

class AddHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @var MediaRepository
     */
    private $mediaRepository;

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param MediaRepository $mediaRepository
     * @param UserRepository $userRepository
     */
    public function __construct(MediaRepository $mediaRepository, UserRepository $userRepository)
    {
        $this->mediaRepository = $mediaRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/admin/blog/add.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $media = $this->mediaRepository->findAll();
        $users = $this->userRepository->findAll();

        $data = [];
        $data['media'] = $media;
        $data['users'] = $users;

        return $this->render($response, $data);
    }
}
