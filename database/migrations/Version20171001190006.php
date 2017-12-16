<?php declare(strict_types = 1);

namespace WouterDeSchuyter\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171001190006 extends AbstractMigration
{
    private const TABLE = 'user';

    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $table = $schema->createTable(self::TABLE);
        $table->addColumn('id', 'uuid');
        $table->addColumn('name', 'string')->setLength(32)->setNotnull(false);
        $table->addColumn('email', 'string')->setLength(64);
        $table->addColumn('salt', 'string')->setLength(64);
        $table->addColumn('password', 'string')->setLength(64);
        $table->addColumn('created_at', 'datetime')->setDefault('CURRENT_TIMESTAMP');
        $table->addColumn('updated_at', 'datetime')->setNotnull(false);
        $table->addColumn('activated_at', 'datetime')->setNotnull(false);
        $table->addColumn('deleted_at', 'datetime')->setNotnull(false);
        $table->setPrimaryKey(['id']);
        $table->addUniqueIndex(['email']);
        $table->addIndex(['activated_at']);
        $table->addIndex(['deleted_at']);
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $schema->dropTable(self::TABLE);
    }
}
