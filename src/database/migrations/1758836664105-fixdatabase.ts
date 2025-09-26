import { MigrationInterface, QueryRunner } from "typeorm";

export class Fixdatabase1758836664105 implements MigrationInterface {
    name = 'Fixdatabase1758836664105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`seasonal_prices\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`start_date\` timestamp NOT NULL, \`end_date\` timestamp NOT NULL, \`price_multiplier\` decimal(5,2) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`seasonal_prices\``);
    }

}
