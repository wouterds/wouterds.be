<?php

namespace WouterDeSchuyter\Application\Http\Validators\Admin\Media;

use Slim\Http\Request;

class AddRequestValidator
{
    /**
     * @var array
     */
    private $errors = [];

    /**
     * @param Request $request
     * @return bool
     */
    public function validate(Request $request)
    {
        $validFile = $this->validateFile($request);

        return $validFile;
    }

    /**
     * @param Request $request
     * @return bool
     */
    private function validateFile(Request $request)
    {
        $file = $request->getUploadedFiles()['file'];

        if (empty($file)) {
            $this->errors['file'] = ['You can not leave this field empty.'];
            return false;
        }

        return true;
    }

    /**
     * @return array|bool
     */
    public function getErrors()
    {
        return $this->errors;
    }
}
