<?php

namespace WouterDeSchuyter\Application\Http\Validators\Admin;

use Psr\Http\Message\ServerRequestInterface as Request;
use Valitron\Validator;

class SignUpRequestValidator
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
            ->rule('required', ['name', 'email', 'password', 'passwordVerification'])
            ->message('You can not leave this field empty.');
        $this->validator
            ->rule('email', 'email')
            ->message('Please enter a valid email.');
        $this->validator
            ->rule('equals', 'passwordVerification', 'password')
            ->message('Please make sure your password and password verification match.');

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
