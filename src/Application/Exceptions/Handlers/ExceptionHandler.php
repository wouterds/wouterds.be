<?php

namespace WouterDeSchuyter\Application\Exceptions\Handlers;

use Slim\Http\Request;
use Slim\Http\Response;
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
