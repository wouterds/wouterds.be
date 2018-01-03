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
     * @var string
     */
    private $url;

    /**
     * @var UploadedFile
     */
    private $uploadedFile;

    /**
     * @param string|null $label
     * @param string|null $url
     * @param UploadedFile|null $uploadedFile
     */
    public function __construct(string $label = null, string $url = null, UploadedFile $uploadedFile = null)
    {
        $this->label = $label;
        $this->url = $url;
        $this->uploadedFile = $uploadedFile;
    }

    /**
     * @return string|null
     */
    public function getLabel(): ?string
    {
        return $this->label;
    }

    /**
     * @return string|null
     */
    public function getUrl(): ?string
    {
        return $this->url;
    }

    /**
     * @return UploadedFile|null
     */
    public function getUploadedFile(): ?UploadedFile
    {
        return $this->uploadedFile;
    }
}
