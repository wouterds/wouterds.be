<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Media;

use Psr\Http\Message\UploadedFileInterface;
use Slim\Http\Request;
use Slim\Http\Response;
use WouterDeSchuyter\Domain\Media\Media;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Infrastructure\Filesystem\Filesystem;

class AddPostHandler
{
    /**
     * @var AuthenticatedUser
     */
    private $authenticatedUser;

    /**
     * @var Filesystem
     */
    private $filesystem;

    /**
     * @param AuthenticatedUser $authenticatedUser
     * @param Filesystem $filesystem
     */
    public function __construct(AuthenticatedUser $authenticatedUser, Filesystem $filesystem)
    {
        $this->authenticatedUser = $authenticatedUser;
        $this->filesystem = $filesystem;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $label = $request->getParam('label');

        /** @var UploadedFileInterface $uploadedFile */
        $uploadedFile = $request->getUploadedFiles()['file'];

        $media = new Media(
            $this->authenticatedUser->getUser()->getId(),
            $uploadedFile->getClientFilename(),
            $uploadedFile->getClientMediaType(),
            $uploadedFile->getSize()
        );

        if (!empty($label)) {
            $media->setName($label);
        }

        if ($this->filesystem->store($media, $uploadedFile->getStream()) === false) {
            return $response->withStatus(400);
        }

        return $response->withJson(['data' => $media]);
    }
}
