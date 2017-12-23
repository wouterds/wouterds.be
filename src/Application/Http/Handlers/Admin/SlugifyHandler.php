<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin;


use Cocur\Slugify\Slugify;
use Slim\Http\Request;
use Slim\Http\Response;

class SlugifyHandler
{
    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $text = $request->getParam('text');

        return $response->withJson([
            'data' => [
                'slug' => (new Slugify())->slugify($text)
            ]
        ]);
    }
}
