<?php

namespace WouterDeSchuyter\Tests\Database\Application\Users;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use WouterDeSchuyter\Application\Users\DbalUserRepository;
use WouterDeSchuyter\Domain\Users\UserId;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Tests\Database\DatabaseTestCase;

class DbalUserRepositoryTest extends DatabaseTestCase
{
    /**
     * @var UserRepository
     */
    private $repository;

    public function setUp()
    {
        $this->repository = new DbalUserRepository($this->getConnection());
    }

    /**
     * @test
     */
    public function shouldAddNewUser()
    {
        $user = $this->randomUser();
        $this->repository->add($user);

        $this->assertRowExists(DbalUserRepository::TABLE, [
            'id'    => $user->getId(),
            'name'  => $user->getName(),
            'email' => $user->getEmail(),
        ]);
    }

    /**
     * @test
     */
    public function shouldThrowWhenTryingToAddSameUserAgain()
    {
        $user = $this->randomUser();
        $this->repository->add($user);

        $this->expectException(UniqueConstraintViolationException::class);
        $this->repository->add($user);
    }

    /**
     * @test
     */
    public function shouldFindExistingUserById()
    {
        $user = $this->randomUser();
        $this->repository->add($user);

        $found = $this->repository->find($user->getId());

        $this->assertEquals($user, $found);
    }

    /**
     * @test
     */
    public function shouldReturnNullWhenTryingToFindNotExistingUserById()
    {
        $user = $this->randomUser();
        $this->repository->add($user);

        $found = $this->repository->find(new UserId($this->faker->uuid));

        $this->assertNull($found);
    }

    /**
     * @test
     */
    public function shouldFindExistingUserByEmail()
    {
        $user = $this->randomUser();
        $this->repository->add($user);

        $found = $this->repository->findByEmail($user->getEmail());

        $this->assertEquals($user, $found);
    }

    /**
     * @test
     */
    public function shouldReturnNullWhenTryingToFindNotExistingUserByEmail()
    {
        $user = $this->randomUser();
        $this->repository->add($user);

        $found = $this->repository->findByEmail($this->faker->email);

        $this->assertNull($found);
    }
}
