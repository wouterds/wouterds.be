<?php

namespace WouterDeSchuyter\Tests;

use Faker\Factory;
use Faker\Generator;
use PHPUnit\Framework\TestCase as PHPUnitTestCase;
use WouterDeSchuyter\Domain\Users\User;

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

    /**
     * @return User
     */
    protected function randomUser()
    {
        return User::fromArray([
            'email'    => $this->faker->email,
            'password' => $this->faker->sha256,
            'name'     => $this->faker->name,
        ]);
    }
}
