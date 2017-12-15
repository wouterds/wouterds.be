<?php

namespace WouterDeSchuyter\Tests\Unit\Infrastructure\ValueObjects;

use Ramsey\Uuid\Exception\InvalidUuidStringException;
use Ramsey\Uuid\Uuid as BaseUuid;
use WouterDeSchuyter\Infrastructure\ValueObjects\Uuid;
use WouterDeSchuyter\Tests\TestCase;

class UuidTest extends TestCase
{
    /**
     * @test
     */
    public function throwsExceptionForInvalidValue()
    {
        $this->expectException(InvalidUuidStringException::class);
        new Uuid($this->faker->randomAscii);
    }

    /**
     * @test
     */
    public function constructsWithoutValue()
    {
        $uuid = new Uuid();
        $this->assertTrue(BaseUuid::isValid($uuid));
    }

    /**
     * @test
     */
    public function constructFromValidValue()
    {
        $uuid = new Uuid($this->faker->uuid);
        $this->assertTrue(BaseUuid::isValid($uuid));
    }

    /**
     * @test
     */
    public function returnsUuidWhenCastedToString()
    {
        $uuidString = $this->faker->uuid;

        $uuid = new Uuid($uuidString);
        $this->assertInternalType('string', $uuid->__toString());
        $this->assertEquals($uuidString, $uuid->__toString());
    }
}
