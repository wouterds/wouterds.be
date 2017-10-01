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
     * @param array $array
     * @return User
     */
    public static function fromArray(array $array): User
    {
        $user = new User($array['name'], $array['email']);
        $user->id = (int) $array['id'];
        $user->approved = (bool) $array['approved'];
        $user->createdAt = Carbon::createFromFormat(Carbon::DEFAULT_TO_STRING_FORMAT, $array['created_at']);

        if (!empty($array['updated_at'])) {
            $user->updatedAt = Carbon::createFromFormat(Carbon::DEFAULT_TO_STRING_FORMAT, $array['updated_at']);
        }

        if (!empty($array['deleted_at'])) {
            $user->updatedAt = Carbon::createFromFormat(Carbon::DEFAULT_TO_STRING_FORMAT, $array['deleted_at']);
        }

        return $user;
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
     * @return bool
     */
    public function isDeleted(): bool
    {
        return !empty($this->deletedAt);
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
