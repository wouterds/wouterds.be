<?php

namespace WouterDeSchuyter\Domain\AccessLogs;

use JsonSerializable;
use WouterDeSchuyter\Infrastructure\ValueObjects\DateTime;

class AccessLog implements JsonSerializable
{
    /**
     * @var AccessLogId
     */
    private $id;

    /**
     * @var string
     */
    private $method;

    /**
     * @var int
     */
    private $statusCode;

    /**
     * @var string
     */
    private $path;

    /**
     * @var string
     */
    private $cfRayId;

    /**
     * @var string
     */
    private $ip;

    /**
     * @var string
     */
    private $connectingIp;

    /**
     * @var string
     */
    private $connectingCountry;

    /**
     * @var string
     */
    private $userAgent;

    /**
     * @var DateTime
     */
    private $timestamp;

    /**
     * @var DateTime|null
     */
    private $createdAt;

    /**
     * @var DateTime|null
     */
    private $updatedAt;

    /**
     * @param string $method
     * @param int $statusCode
     * @param string $path
     * @param string $cfRayId
     * @param string $ip
     * @param string $connectingIp
     * @param string $connectingCountry
     * @param string $userAgent
     * @param DateTime $timestamp
     */
    public function __construct(
        string $method,
        int $statusCode,
        string $path,
        string $cfRayId,
        string $ip,
        string $connectingIp,
        string $connectingCountry,
        string $userAgent,
        DateTime $timestamp
    ) {
        $this->id = new AccessLogId();
        $this->method = $method;
        $this->statusCode = $statusCode;
        $this->path = $path;
        $this->cfRayId = $cfRayId;
        $this->ip = $ip;
        $this->connectingIp = $connectingIp;
        $this->connectingCountry = $connectingCountry;
        $this->userAgent = $userAgent;
        $this->timestamp = $timestamp;
        $this->createdAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    /**
     * @return AccessLogId
     */
    public function getId(): AccessLogId
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getMethod(): string
    {
        return $this->method;
    }

    /**
     * @return int
     */
    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    /**
     * @return string
     */
    public function getPath(): string
    {
        return $this->path;
    }

    /**
     * @return string
     */
    public function getCfRayId(): string
    {
        return $this->cfRayId;
    }

    /**
     * @return string
     */
    public function getIp(): string
    {
        return $this->ip;
    }

    /**
     * @return string
     */
    public function getConnectingIp(): string
    {
        return $this->connectingIp;
    }

    /**
     * @return string
     */
    public function getConnectingCountry(): string
    {
        return $this->connectingCountry;
    }

    /**
     * @return string
     */
    public function getUserAgent(): string
    {
        return $this->userAgent;
    }

    /**
     * @return DateTime
     */
    public function getTimestamp(): DateTime
    {
        return $this->timestamp;
    }

    /**
     * @return null|DateTime
     */
    public function getCreatedAt(): ?DateTime
    {
        return $this->createdAt;
    }

    /**
     * @return null|DateTime
     */
    public function getUpdatedAt(): ?DateTime
    {
        return $this->updatedAt;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return get_object_vars($this);
    }
}
