<?php

namespace WouterDeSchuyter\Infrastructure\Vimeo;

use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\RequestOptions;

class Api
{
    /**
     * @var string
     */
    private $baseUri = 'https://api.vimeo.com';

    /**
     * @var string
     */
    private $key;

    /**
     * @var GuzzleClient
     */
    private $client;

    /**
     * @param string $key
     */
    public function __construct(string $key)
    {
        $this->key = $key;
        $this->client = new GuzzleClient();
    }

    /**
     * @param string $id
     * @return array
     */
    public function getVideoMeta(string $id): ?array
    {
        $response = $this->client->request('GET', "{$this->baseUri}/videos/{$id}", [
            RequestOptions::HEADERS => [
                'Authorization' => "Bearer {$this->key}",
            ],
        ]);

        $response = json_decode($response->getBody()->getContents(), true);

        if (empty($response['uri'])) {
            return null;
        }

        return $response;
    }
}
