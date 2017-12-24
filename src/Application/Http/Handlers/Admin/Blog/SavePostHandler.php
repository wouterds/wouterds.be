<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Blog;

use Exception;
use League\Tactician\CommandBus;
use Slim\Http\Request;
use Slim\Http\Response;
use Teapot\StatusCode;
use WouterDeSchuyter\Application\Http\Validators\Admin\Blog\PostRequestValidator;
use WouterDeSchuyter\Domain\Blog\BlogPostId;
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
     * @param PostRequestValidator $addRequestValidator
     * @param CommandBus $commandBus
     */
    public function __construct(PostRequestValidator $addRequestValidator, CommandBus $commandBus)
    {
        $this->postRequestValidator = $addRequestValidator;
        $this->commandBus = $commandBus;
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
                new DateTime($request->getParam('publishedAt'))
            ));
        } catch (Exception $e) {
            return $response->withJson(false, StatusCode::BAD_REQUEST);
        }

        return $response->withJson(true);
    }
}
