<?php

namespace WouterDeSchuyter\Tests\Database;

use Doctrine\DBAL\Connection;
use InvalidArgumentException;
use WouterDeSchuyter\Application\Container;
use WouterDeSchuyter\Tests\TestCase;

abstract class DatabaseTestCase extends TestCase
{
    /**
     * @var Connection
     */
    private $connection;

    /**
     * @before
     */
    public function bootstrapConnection()
    {
        $this->connection = Container::load()->get(Connection::class);
        $this->connection->beginTransaction();
    }

    /**
     * @after
     */
    public function rollbackTransaction()
    {
        $this->connection->rollBack();
    }

    /**
     * @return Connection
     */
    protected function getConnection()
    {
        return $this->connection;
    }

    /**
     * @param string $tableName
     * @param array $expectedFieldValues
     */
    protected function assertRowExists(string $tableName, array $expectedFieldValues)
    {
        $rowCount = $this->countRows($tableName, $expectedFieldValues);
        $this->assertGreaterThan(0, $rowCount, 'Row not found in the database.');
        $this->assertLessThan(2, $rowCount, "Multiple rows found when only expecting one. (Row count: {$rowCount})");
    }

    /**
     * @param string $tableName
     * @param array $expectedFieldValues
     * @param int $exceptedRowCount
     */
    protected function assertRowsExist(string $tableName, array $expectedFieldValues, int $exceptedRowCount)
    {
        $rowCount = $this->countRows($tableName, $expectedFieldValues);
        $this->assertEquals(
            $exceptedRowCount,
            $rowCount,
            "Did not find $exceptedRowCount rows. Found $rowCount rows instead."
        );
    }

    /**
     * @param string $tableName
     * @param array $expectedFieldValues
     */
    protected function assertRowDoesNotExist(string $tableName, array $expectedFieldValues)
    {
        $rowCount = $this->countRows($tableName, $expectedFieldValues);
        $this->assertEquals(0, $rowCount, "Expected to find no rows in the database. Found {$rowCount} rows");
    }

    /**
     * @param string $tableName
     * @param array $expectedFieldValues
     * @return int
     */
    private function countRows(string $tableName, array $expectedFieldValues): int
    {
        if (empty($expectedFieldValues)) {
            throw new InvalidArgumentException("Expected field values array can not be empty.");
        }

        $parsedWheres = [];
        $query = "SELECT * FROM {$tableName} WHERE";

        foreach ($expectedFieldValues as $fieldName => $fieldValue) {
            if ($fieldValue === null) {
                $parsedWheres[] = "`$fieldName` IS NULL";
                continue;
            }

            $parsedWheres[] = "`$fieldName` = :$fieldName";
        }

        $query .= implode(' AND ', $parsedWheres);
        $statement = $this->connection->getWrappedConnection()->prepare($query);

        foreach ($expectedFieldValues as $fieldName => $fieldValue) {
            if ($fieldValue !== null) {
                $statement->bindValue($fieldName, $fieldValue);
            }
        }

        $statement->execute();

        return $statement->rowCount();
    }
}
