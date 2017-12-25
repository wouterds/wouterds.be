<?php declare(strict_types = 1);

namespace WouterDeSchuyter\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171221124603 extends AbstractMigration
{
    private const TABLE = 'blog_post';

    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $table = $schema->createTable(self::TABLE);
        $table->addColumn('id', 'uuid');
        $table->addColumn('user_id', 'uuid');
        $table->addColumn('media_id', 'uuid');
        $table->addColumn('title', 'string')->setLength(191);
        $table->addColumn('slug', 'string')->setLength(191);
        $table->addColumn('excerpt', 'text');
        $table->addColumn('body', 'text');
        $table->addColumn('published_at', 'datetime')->setNotnull(false);
        $table->addColumn('deleted_at', 'datetime')->setNotnull(false);
        $table->addColumn('created_at', 'datetime')->setDefault('CURRENT_TIMESTAMP');
        $table->addColumn('updated_at', 'datetime')->setNotnull(false);
        $table->setPrimaryKey(['id']);
        $table->addUniqueIndex(['slug']);
        $table->addIndex(['user_id']);
        $table->addIndex(['media_id']);
        $table->addIndex(['published_at']);
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
