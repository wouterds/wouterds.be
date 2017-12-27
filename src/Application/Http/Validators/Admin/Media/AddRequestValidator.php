<?php

namespace WouterDeSchuyter\Application\Http\Validators\Admin\Media;

use Psr\Http\Message\ServerRequestInterface as Request;

class AddRequestValidator
{
    /**
     * @param Request $request
     * @return bool
     */
    public function validate(Request $request)
    {
        $file = $request->getUploadedFiles()['file'];

        return !empty($file);
    }

    /**
     * @return array|bool
     */
    public function getErrors()
    {
        return ['file' => ['You can not leave this field empty.']];
    }
}
