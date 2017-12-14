<?php

namespace WouterDeSchuyter\Application\Http\Validators;

use Psr\Http\Message\ServerRequestInterface as Request;
use Respect\Validation\Validator;

class ContactRequestValidator
{
    /**
     * @param Request $request
     * @return bool
     */
    public function validate(Request $request)
    {
        $validator = Validator::create();
        $validator->addRule(Validator::key('name', Validator::stringType()->notEmpty()));
        $validator->addRule(Validator::key('email', Validator::email()->notEmpty()));
        $validator->addRule(Validator::key('subject', Validator::stringType()->notEmpty()));
        $validator->addRule(Validator::key('message', Validator::stringType()->notEmpty()));

        return $validator->assert($request->getParsedBody());
    }
}
