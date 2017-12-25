<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Blog;

use Slim\Http\Request;
use Slim\Http\Response;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Domain\Media\MediaRepository;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Infrastructure\View\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\ViewAwareTrait;

class DetailHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @var MediaRepository
     */
    private $mediaRepository;

    /**
     * @var BlogPostRepository
     */
    private $blogPostRepository;

    /**
     * @param BlogPostRepository $blogPostRepository
     * @param UserRepository $userRepository
     * @param MediaRepository $mediaRepository
     */
    public function __construct(
        BlogPostRepository $blogPostRepository,
        UserRepository $userRepository,
        MediaRepository $mediaRepository
    ) {
        $this->userRepository = $userRepository;
        $this->mediaRepository = $mediaRepository;
        $this->blogPostRepository = $blogPostRepository;
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/blog/detail.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param string $slug
     * @return Response
     */
    public function __invoke(Request $request, Response $response, string $slug): Response
    {
        $blogPost = $this->blogPostRepository->findBySlug($slug);

        if (empty($blogPost)) {
            return $response->withRedirect('/404');
        }

        $user = $this->userRepository->find($blogPost->getUserId());
        $media = $this->mediaRepository->find($blogPost->getMediaId());

        $data = [];
        $data['blogPost'] = $blogPost;
        $data['user'] = $user;
        $data['media'] = $media;

        return $this->render($response, $data);
    }
}
