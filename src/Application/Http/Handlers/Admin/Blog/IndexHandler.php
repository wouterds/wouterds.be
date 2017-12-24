<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Blog;

use Slim\Http\Request;
use Slim\Http\Response;
use WouterDeSchuyter\Domain\Blog\BlogPost;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\Admin\ViewAwareTrait;

class IndexHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @var BlogPostRepository
     */
    private $blogPostRepository;
    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param BlogPostRepository $blogPostRepository
     * @param UserRepository $userRepository
     */
    public function __construct(BlogPostRepository $blogPostRepository, UserRepository $userRepository)
    {
        $this->blogPostRepository = $blogPostRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/admin/blog/index.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $blogPosts = $this->blogPostRepository->findAll();

        $userIds = array_map(function ($blogPost) {
            /** @var BlogPost $blogPost */
            return $blogPost->getUserId();
        }, $blogPosts);

        $users = $this->userRepository->findMultiple($userIds);

        $data = [];
        $data['blogPosts'] = $blogPosts;
        $data['users'] = $users;

        return $this->render($response, $data);
    }
}
