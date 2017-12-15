<?php

namespace WouterDeSchuyter\Tests\Unit\Infrastructure\Config;

use WouterDeSchuyter\Infrastructure\Config\Config;
use WouterDeSchuyter\Tests\TestCase;

class ConfigTest extends TestCase
{
    /**
     * @test
     * @dataProvider providesValuesWithNotResolvableKeys
     * @param array $data
     * @param array $searchKeys
     */
    public function shouldReturnNullWhenNotFoundInValues(array $data, array $searchKeys)
    {
        $config = new Config($data);

        foreach ($searchKeys as $key) {
            $this->assertNull($config->get($key));
        }
    }

    /**
     * @test
     * @dataProvider providesValuesWithResolvableKeys
     * @param array $data
     * @param string $key
     * @param string $expectedValue
     */
    public function shouldReturnValueWhenFoundInValues(array $data, string $key, string $expectedValue)
    {
        $config = new Config($data);

        $this->assertSame($expectedValue, $config->get($key));
    }

    /**
     * @return array
     */
    public function providesValuesWithResolvableKeys(): array
    {
        return [
            [
                [
                    'color' => 'red',
                    'location' => 'Belgium',
                    'name' => 'Wouter',
                ],
                'color',
                'red',
            ],
            [
                [
                    'color' => 'red',
                    'location' => 'Belgium',
                    'name' => 'Wouter',
                ],
                'location',
                'Belgium',
            ],
            [
                [
                    'color' => 'red',
                    'location' => 'Belgium',
                    'name' => 'Wouter',
                ],
                'name',
                'Wouter',
            ],
        ];
    }

    /**
     * @return array
     */
    public function providesValuesWithNotResolvableKeys(): array
    {
        return [
            [
                [
                    'key1' => 'a',
                    'key2' => 'b',
                    'key3' => 'c',
                ],
                [
                    'key4',
                    'key5',
                    'key6',
                ]
            ],
            [
                [
                    'name' => 'Wouter',
                    'website' => 'http://google.com',
                    'color' => 'red',
                ],
                [
                    'car',
                    'location',
                    'birthday',
                ]
            ]
        ];
    }
}
