<?php

namespace WouterDeSchuyter\Application\Exceptions\Handlers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Throwable;
use Tracy\Debugger;

class ExceptionHandler
{
    /**
     * @param Request $request
     * @param Response $response
     * @param Throwable $e
     */
    public function __invoke(Request $request, Response $response, Throwable $e)
    {
        Debugger::exceptionHandler($e, true);
    }
}
