<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Blog;

use Slim\Http\Request;
use Slim\Http\Response;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Infrastructure\View\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\ViewAwareTrait;

class IndexHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    private const MAX_POSTS_PER_PAGE = 7;

    /**
     * @var BlogPostRepository
     */
    private $blogPostRepository;

    /**
     * @param BlogPostRepository $blogPostRepository
     */
    public function __construct(BlogPostRepository $blogPostRepository)
    {
        $this->blogPostRepository = $blogPostRepository;
    }

    /**
     * @return null|string
     */
    public function getAmpStylesheet(): ?string
    {
        return 'blog.index.css';
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/blog/index.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param int $page
     * @return Response
     */
    public function __invoke(Request $request, Response $response, int $page = 0): Response
    {
        // Get total blogpost count
        $blogPostsCount = $this->blogPostRepository->getPublishedCount();

        // Invalid page?
        if ($page < 0 || $page > $blogPostsCount / self::MAX_POSTS_PER_PAGE) {
            return $response->withRedirect($this->router->pathFor('blog'));
        }

        // Get blogposts
        $blogPosts = $this->blogPostRepository->findPublished(
            $page * self::MAX_POSTS_PER_PAGE,
            self::MAX_POSTS_PER_PAGE
        );

        $data = [];
        $data['blogPosts'] = $blogPosts;
        $data['blogPostPage'] = $page;
        $data['blogPostCount'] = $blogPostsCount;
        $data['blogPostMaxPerPage'] = self::MAX_POSTS_PER_PAGE;

        if ($page > 0) {
            $data['page']['path'] = $this->router->pathFor('blog');
            $data['page']['amp']['path'] = $this->router->pathFor('blog:amp');
        }

        return $this->render($response, $data);
    }
}
