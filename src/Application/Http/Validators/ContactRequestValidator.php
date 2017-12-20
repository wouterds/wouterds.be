<?php

namespace WouterDeSchuyter\Application\Http\Validators;

use Slim\Http\Request;
use Valitron\Validator;

class ContactRequestValidator
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
        $this->validator = new Validator($request->getParams());
        $this->validator
            ->rule('required', ['name', 'email', 'subject', 'message'])
            ->message('You can not leave this field empty.');
        $this->validator
            ->rule('email', 'email')
            ->message('Please enter a valid email.');

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
