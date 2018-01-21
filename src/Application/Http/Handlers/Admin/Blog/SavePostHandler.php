<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Blog;

use Exception;
use League\Tactician\CommandBus;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Router;
use Teapot\StatusCode;
use WouterDeSchuyter\Application\Http\Validators\Admin\Blog\PostRequestValidator;
use WouterDeSchuyter\Domain\Blog\BlogPostId;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Domain\Commands\Blog\SaveBlogPost;
use WouterDeSchuyter\Domain\Media\MediaId;
use WouterDeSchuyter\Domain\Users\UserId;
use WouterDeSchuyter\Infrastructure\ValueObjects\DateTime;

class SavePostHandler
{
    /**
     * @var PostRequestValidator
     */
    private $postRequestValidator;

    /**
     * @var CommandBus
     */
    private $commandBus;

    /**
     * @var BlogPostRepository
     */
    private $blogPostRepository;

    /**
     * @var Router
     */
    private $router;

    /**
     * @param PostRequestValidator $addRequestValidator
     * @param CommandBus $commandBus
     * @param BlogPostRepository $blogPostRepository
     * @param Router $router
     */
    public function __construct(
        PostRequestValidator $addRequestValidator,
        CommandBus $commandBus,
        BlogPostRepository $blogPostRepository,
        Router $router
    ) {
        $this->postRequestValidator = $addRequestValidator;
        $this->commandBus = $commandBus;
        $this->blogPostRepository = $blogPostRepository;
        $this->router = $router;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        if (!$this->postRequestValidator->validate($request)) {
            return $response->withJson($this->postRequestValidator->getErrors(), StatusCode::BAD_REQUEST);
        }

        try {
            $this->commandBus->handle(new SaveBlogPost(
                !empty($request->getParam('blogPostId')) ? new BlogPostId($request->getParam('blogPostId')) : null,
                $request->getParam('title'),
                $request->getParam('slug'),
                $request->getParam('body'),
                $request->getParam('excerpt'),
                new UserId($request->getParam('userId')),
                new MediaId($request->getParam('mediaId')),
                !empty($request->getParam('publishedAt')) ? new DateTime($request->getParam('publishedAt')) : null
            ));
        } catch (Exception $e) {
            return $response->withJson(false, StatusCode::BAD_REQUEST);
        }

        $blogPost = $this->blogPostRepository->findBySlug($request->getParam('slug'));

        return $response->withJson([
            'data' => [
                'new' => empty($request->getParam('blogPostId')),
                'redirect' => $this->router->pathFor('admin.blog.edit', ['id' => $blogPost->getId()]),
            ],
        ]);
    }
}
