<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Blog;

use Slim\Http\Request;
use Slim\Http\Response;
use WouterDeSchuyter\Domain\Blog\BlogPostId;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Domain\Media\MediaRepository;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareTrait;

class EditHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @var BlogPostRepository
     */
    private $blogPostRepository;

    /**
     * @var MediaRepository
     */
    private $mediaRepository;

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param BlogPostRepository $blogPostRepository
     * @param MediaRepository $mediaRepository
     * @param UserRepository $userRepository
     */
    public function __construct(
        BlogPostRepository $blogPostRepository,
        MediaRepository $mediaRepository,
        UserRepository $userRepository
    ) {
        $this->blogPostRepository = $blogPostRepository;
        $this->mediaRepository = $mediaRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/admin/blog/post.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param string $id
     * @return Response
     */
    public function __invoke(Request $request, Response $response, string $id): Response
    {
        $blogPost = $this->blogPostRepository->find(new BlogPostId($id));
        $media = $this->mediaRepository->findAll();
        $users = $this->userRepository->findAll();

        $data = [];
        $data['blogPost'] = $blogPost;
        $data['media'] = $media;
        $data['users'] = $users;

        return $this->render($response, $data);
    }
}
