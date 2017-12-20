<?php

namespace WouterDeSchuyter\Domain\Commands\Media;

use Slim\Http\UploadedFile;

class AddMedia
{
    /**
     * @var string
     */
    private $label;

    /**
     * @var UploadedFile
     */
    private $uploadedFile;

    /**
     * @param string|null $label
     * @param UploadedFile $uploadedFile
     */
    public function __construct(string $label = null, UploadedFile $uploadedFile)
    {
        $this->label = $label;
        $this->uploadedFile = $uploadedFile;
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return $this->label;
    }

    /**
     * @return UploadedFile
     */
    public function getUploadedFile(): UploadedFile
    {
        return $this->uploadedFile;
    }
}
