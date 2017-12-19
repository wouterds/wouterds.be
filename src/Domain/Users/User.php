<?php

namespace WouterDeSchuyter\Domain\Users;

use JsonSerializable;
use WouterDeSchuyter\Infrastructure\ValueObjects\DateTime;

class User implements JsonSerializable
{
    private const PROTECTED = [
        'salt',
        'password',
    ];

    /**
     * @var UserId
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
     * @var string
     */
    private $password;

    /**
     * @var string
     */
    private $salt;

    /**
     * @var DateTime|null
     */
    private $createdAt;

    /**
     * @var DateTime|null
     */
    private $updatedAt;

    /**
     * @var DateTime|null
     */
    private $activatedAt;

    /**
     * @param string $email
     * @param string $password
     * @param string $salt
     */
    public function __construct(string $email, string $password, string $salt = null)
    {
        $this->id = new UserId();

        if (empty($salt)) {
            $salt = hash('sha256', microtime(true). $this->id);
            $password = self::hashPassword($salt, $password);
        }

        $this->email = $email;
        $this->password = $password;
        $this->salt = $salt;
        $this->createdAt = new DateTime();
        $this->updatedAt = new DateTime();
        $this->activatedAt = null;
    }

    /**
     * @param array $data
     * @return User
     */
    public static function fromArray(array $data): User
    {
        $user = new User($data['email'], $data['password'], !empty($data['salt']) ? $data['salt'] : null);
        $user->id = new UserId(!empty($data['id']) ? $data['id'] : null);
        $user->name = !empty($data['name']) ? $data['name'] : null;
        $user->activatedAt = !empty($data['activated_at']) ? new DateTime($data['activated_at']) : null;
        $user->createdAt = !empty($data['created_at']) ? new DateTime($data['created_at']) : null;
        $user->updatedAt = !empty($data['updated_at']) ? new DateTime($data['updated_at']) : null;

        return $user;
    }

    /**
     * @param string $salt
     * @param string $input
     * @return string
     */
    public static function hashPassword(string $salt, string $input): string
    {
        $password = $input;

        for ($i = 0; $i < 1000; $i++) {
            $password = hash('sha256', $salt . $password . $salt);
        }

        return $password;
    }

    /**
     * @return UserId
     */
    public function getId(): UserId
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
     * @param string $name
     */
    public function setName(string $name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * @return string
     */
    public function getSalt(): string
    {
        return $this->salt;
    }

    /**
     * @return DateTime|null
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @return DateTime|null
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * @return DateTime|null
     */
    public function getActivatedAt(): ?DateTime
    {
        return $this->activatedAt;
    }

    /**
     * @param DateTime|null $activatedAt
     */
    public function setActivatedAt(DateTime $activatedAt = null)
    {
        $this->activatedAt = $activatedAt;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        $properties = get_object_vars($this);

        foreach (self::PROTECTED as $property) {
            if (!isset($properties[$property])) {
                continue;
            }

            unset($properties[$property]);
        }

        return $properties;
    }
}
