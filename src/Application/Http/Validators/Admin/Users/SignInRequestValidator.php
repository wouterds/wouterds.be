<?php

namespace WouterDeSchuyter\Application\Http\Validators\Admin\Users;

use Psr\Http\Message\ServerRequestInterface as Request;
use Valitron\Validator;

class SignInRequestValidator
{
    /**
     * @var Validator
     */
    private $validator;

    /**
     * @param Request $request
     * @return bool
     */
    public function validate(Request $request)
    {
        $this->validator = new Validator($request->getParsedBody());
        $this->validator
            ->rule('required', ['email', 'password'])
            ->message('You can not leave this field empty.');

        return $this->validator->validate();
    }

    /**
     * @return array|bool
     */
    public function getErrors()
    {
        return $this->validator->errors();
    }
}
