<?php

namespace Wouterds\Domain\Users;

use Carbon\Carbon;

class User
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $name;

    /**
     * @var string
     */
    private $email;

    /**
     * @var boolean
     */
    private $approved;

    /**
     * @var Carbon
     */
    private $createdAt;

    /**
     * @var Carbon|null
     */
    private $updatedAt;

    /**
     * @var Carbon|null
     */
    private $deletedAt;

    /**
     * @param string $name
     * @param string $email
     */
    public function __construct(string $name, string $email)
    {
        $this->name = $name;
        $this->email = $email;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @return bool
     */
    public function isApproved(): bool
    {
        return $this->approved;
    }

    /**
     * @return Carbon
     */
    public function getCreatedAt(): Carbon
    {
        return $this->createdAt;
    }

    /**
     * @return Carbon|null
     */
    public function getUpdatedAt(): ?Carbon
    {
        return $this->updatedAt;
    }

    /**
     * @return Carbon|null
     */
    public function getDeletedAt(): ?Carbon
    {
        return $this->deletedAt;
    }
}
