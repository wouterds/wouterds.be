<?php declare(strict_types = 1);

namespace WouterDeSchuyter\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171216154807 extends AbstractMigration
{
    private const TABLE = 'user_session';

    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $table = $schema->createTable(self::TABLE);
        $table->addColumn('id', 'uuid');
        $table->addColumn('user_id', 'uuid');
        $table->addColumn('created_at', 'datetime')->setDefault('CURRENT_TIMESTAMP');
        $table->addColumn('updated_at', 'datetime')->setNotnull(false);
        $table->addColumn('deleted_at', 'datetime')->setNotnull(false);
        $table->setPrimaryKey(['id']);
        $table->addUniqueIndex(['user_id']);
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $schema->dropTable(self::TABLE);
    }
}
