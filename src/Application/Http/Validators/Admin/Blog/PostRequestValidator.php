<?php

namespace WouterDeSchuyter\Application\Http\Validators\Admin\Blog;

use Psr\Http\Message\ServerRequestInterface as Request;
use Valitron\Validator;

class PostRequestValidator
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
            ->rule('required', ['title', 'slug', 'body', 'excerpt', 'userId', 'mediaId'])
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
