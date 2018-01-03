<?php

namespace WouterDeSchuyter\Application\Http\Validators\Admin\Media;

use Slim\Http\Request;
use Slim\Http\UploadedFile;

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
    public function validate(Request $request): bool
    {
        $isValidFile = $this->validateFile($request);
        $isValidUrl = $this->validateUrl($request);

        $isValid = ($isValidFile || $isValidUrl);

        if ($isValid) {
            $this->errors = [];
        }

        return $isValid;
    }

    /**
     * @param Request $request
     * @return bool
     */
    private function validateFile(Request $request): bool
    {
        /** @var UploadedFile[] $files */
        $files = $request->getUploadedFiles()['file'];

        if (empty($files)) {
            $this->errors['file'] = ['You can not leave this field empty.'];
            return false;
        }

        foreach ($files as $file) {
            if (empty($file->getSize())) {
                $this->errors['file'] = ['You can not leave this field empty.'];
                return false;
            }
        }

        return true;
    }

    /**
     * @param Request $request
     * @return bool
     */
    private function validateUrl(Request $request): bool
    {
        $url = $request->getParam('url');

        if (empty($url)) {
            $this->errors['url'] = ['You can not leave this field empty.'];
            return false;
        }

        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            $this->errors['url'] = ['The url you entered is invalid.'];
            return false;
        }

        return true;
    }

    /**
     * @return array|bool
     */
    public function getErrors(): array
    {
        return $this->errors;
    }
}
