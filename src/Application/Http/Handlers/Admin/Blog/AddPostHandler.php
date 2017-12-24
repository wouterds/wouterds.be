<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Blog;

use DateTimeZone;
use Exception;
use League\Tactician\CommandBus;
use Slim\Http\Request;
use Slim\Http\Response;
use Teapot\StatusCode;
use WouterDeSchuyter\Application\Http\Validators\Admin\Blog\AddRequestValidator;
use WouterDeSchuyter\Domain\Blog\BlogPostId;
use WouterDeSchuyter\Domain\Commands\Blog\SaveBlogPost;
use WouterDeSchuyter\Domain\Media\MediaId;
use WouterDeSchuyter\Domain\Users\UserId;
use WouterDeSchuyter\Infrastructure\ValueObjects\DateTime;

class AddPostHandler
{
    /**
     * @var AddRequestValidator
     */
    private $addRequestValidator;

    /**
     * @var CommandBus
     */
    private $commandBus;

    /**
     * @param AddRequestValidator $addRequestValidator
     * @param CommandBus $commandBus
     */
    public function __construct(AddRequestValidator $addRequestValidator, CommandBus $commandBus)
    {
        $this->addRequestValidator = $addRequestValidator;
        $this->commandBus = $commandBus;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        if (!$this->addRequestValidator->validate($request)) {
            return $response->withJson($this->addRequestValidator->getErrors(), StatusCode::BAD_REQUEST);
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
                (new DateTime($request->getParam('publishedAt')))->setTimezone(new DateTimeZone('Europe/Brussels'))
            ));
        } catch (Exception $e) {
            return $response->withJson(false, StatusCode::BAD_REQUEST);
        }

        return $response->withJson(true);
    }
}
