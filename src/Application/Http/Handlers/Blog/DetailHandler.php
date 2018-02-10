<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Blog;

use Slim\Exception\NotFoundException;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Router;
use Teapot\StatusCode;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Domain\Media\MediaRepository;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Infrastructure\View\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\ViewAwareTrait;

class DetailHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @var Router
     */
    private $router;

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
     * @param Router $router
     * @param BlogPostRepository $blogPostRepository
     * @param UserRepository $userRepository
     * @param MediaRepository $mediaRepository
     */
    public function __construct(
        Router $router,
        BlogPostRepository $blogPostRepository,
        UserRepository $userRepository,
        MediaRepository $mediaRepository
    ) {
        $this->router = $router;
        $this->userRepository = $userRepository;
        $this->mediaRepository = $mediaRepository;
        $this->blogPostRepository = $blogPostRepository;
    }

    /**
     * @return null|string
     */
    public function getAmpStylesheet(): ?string
    {
        return 'blog.detail.css';
    }

    /**
     * @return array
     */
    public function getAmpPlugins(): array
    {
        return ['youtube', 'vimeo'];
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

        // Temp hack for backwards compatibility
        if (empty($blogPost)) {
            $lastPart = explode('-', $slug);
            $lastPart = end($lastPart);

            if (is_numeric($lastPart)) {
                $slug = str_replace('-' . $lastPart, null, $slug);
                $blogPost = $this->blogPostRepository->findBySlug($slug);
            }

            if ($blogPost) {
                return $response->withRedirect(
                    $this->router->pathFor('blog.detail', ['slug' => $slug]),
                    StatusCode::PERMANENT_REDIRECT
                );
            }
        }

        if (empty($blogPost)) {
            throw new NotFoundException($request, $response);
        }

        $user = $this->userRepository->find($blogPost->getUserId());
        $media = $this->mediaRepository->find($blogPost->getMediaId());

        $data = [];
        $data['blogPost'] = $blogPost;
        $data['user'] = $user;
        $data['media'] = $media;

        // Viewed blog post
        $this->blogPostRepository->viewed($blogPost);

        return $this->render($response, $data);
    }
}
