<?php

namespace WouterDeSchuyter\Tests;

use Faker\Factory;
use Faker\Generator;
use PHPUnit\Framework\TestCase as PHPUnitTestCase;

abstract class TestCase extends PHPUnitTestCase
{
    /**
     * @var Generator
     */
    protected $faker;

    /**
     * @before
     */
    public function bootstrapFaker()
    {
        $this->faker = Factory::create();
    }
}
