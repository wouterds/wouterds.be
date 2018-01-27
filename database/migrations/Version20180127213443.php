<?php declare(strict_types = 1);

namespace WouterDeSchuyter\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\DBAL\Schema\SchemaException;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20180127213443 extends AbstractMigration
{
    private const TABLE = 'blog_post';

    /**
     * @param Schema $schema
     * @throws SchemaException
     */
    public function up(Schema $schema)
    {
        $table = $schema->getTable(self::TABLE);
        $table->addColumn('views', 'integer')->setDefault(0);
    }

    /**
     * @param Schema $schema
     * @throws SchemaException
     */
    public function down(Schema $schema)
    {
        $table = $schema->getTable(self::TABLE);
        $table->dropColumn('views');
    }
}
