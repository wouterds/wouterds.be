<?php

namespace WouterDeSchuyter\Infrastructure\Youtube;

use GuzzleHttp\Client as GuzzleClient;

class Api
{
    /**
     * @var string
     */
    private $baseUri = 'https://www.googleapis.com/youtube/v3';

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
        $response = $this->client->get("{$this->baseUri}/videos", [
            'query' => [
                'part' => 'snippet',
                'id' => $id,
                'key' => $this->key,
            ]
        ]);

        $response = json_decode($response->getBody()->getContents(), true);

        if (empty($response['items'])) {
            return null;
        }

        return reset($response['items']);
    }
}
