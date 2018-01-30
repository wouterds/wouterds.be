<?php declare(strict_types = 1);

namespace WouterDeSchuyter\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20180127224037 extends AbstractMigration
{
    private const TABLE = 'access_log';

    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $table = $schema->createTable(self::TABLE);
        $table->addColumn('id', 'uuid');
        $table->addColumn('method', 'string')->setLength(4);
        $table->addColumn('status_code', 'integer');
        $table->addColumn('path', 'string');
        $table->addColumn('cf_ray_id', 'string')->setLength(32);
        $table->addColumn('ip', 'string')->setLength(64);
        $table->addColumn('connecting_ip', 'string')->setLength(64);
        $table->addColumn('connecting_country', 'string')->setLength(2);
        $table->addColumn('user_agent', 'string');
        $table->addColumn('timestamp', 'datetime');
        $table->addColumn('created_at', 'datetime')->setDefault('CURRENT_TIMESTAMP');
        $table->addColumn('updated_at', 'datetime')->setNotnull(false);
        $table->setPrimaryKey(['id']);
        $table->addIndex(['cf_ray_id', 'ip']);
        $table->addIndex(['connecting_ip', 'connecting_country']);
        $table->addIndex(['method']);
        $table->addIndex(['status_code']);
        $table->addIndex(['path']);
        $table->addIndex(['timestamp']);
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
