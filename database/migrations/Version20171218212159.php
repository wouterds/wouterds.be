<?php declare(strict_types = 1);

namespace WouterDeSchuyter\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171218212159 extends AbstractMigration
{
    private const TABLE = 'media';

    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $table = $schema->createTable(self::TABLE);
        $table->addColumn('id', 'uuid');
        $table->addColumn('user_id', 'uuid');
        $table->addColumn('name', 'string')->setLength(64);
        $table->addColumn('content_type', 'string')->setLength(32);
        $table->addColumn('size', 'integer');
        $table->addColumn('md5', 'string')->setLength(32);
        $table->addColumn('deleted_at', 'datetime')->setNotnull(false);
        $table->addColumn('created_at', 'datetime')->setDefault('CURRENT_TIMESTAMP');
        $table->addColumn('updated_at', 'datetime')->setNotnull(false);
        $table->setPrimaryKey(['id']);
        $table->addUniqueIndex(['user_id', 'md5']);
        $table->addIndex(['deleted_at']);
        $table->addIndex(['created_at']);
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $schema->dropTable(self::TABLE);
    }
}
