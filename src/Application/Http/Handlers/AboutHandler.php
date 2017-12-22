<?php

namespace WouterDeSchuyter\Application\Http\Handlers;

use Slim\Http\Request;
use Slim\Http\Response;
use WouterDeSchuyter\Infrastructure\View\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\ViewAwareTrait;

class AboutHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/about.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $birthday = strtotime('1992-12-13');
        $age = date('Y') - date('Y', $birthday);

        $data = [
            'birthday' => $birthday,
            'age' => $age,
        ];

        return $this->render($response, $data);
    }
}
