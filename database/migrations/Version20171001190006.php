<?php

namespace Wouterds\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171001190006 extends AbstractMigration
{
    private const TABLE_NAME = 'user';

    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $table = $schema->createTable(self::TABLE_NAME);
        $table->addColumn('id', 'integer')->setAutoincrement(true)->setUnsigned(true);
        $table->addColumn('name', 'string')->setLength(32);
        $table->addColumn('email', 'string')->setLength(64);
        $table->addColumn('salt', 'string')->setLength(64);
        $table->addColumn('password', 'string')->setLength(64);
        $table->addColumn('approved', 'boolean')->setDefault(false);
        $table->addColumn('created_at', 'datetime')->setDefault('CURRENT_TIMESTAMP');
        $table->addColumn('updated_at', 'datetime')->setNotnull(false);
        $table->addColumn('deleted_at', 'datetime')->setNotnull(false);
        $table->setPrimaryKey(['id']);
        $table->addIndex(['email']);
        $table->addIndex(['approved']);
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $schema->dropTable(self::TABLE_NAME);
    }
}
