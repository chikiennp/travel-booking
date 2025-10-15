import { MigrationInterface, QueryRunner } from "typeorm";

export class FixReviewTables1760504100072 implements MigrationInterface {
    name = 'FixReviewTables1760504100072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`properties\` ADD \`star\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`properties\` ADD \`rating\` decimal(3,1) NOT NULL DEFAULT '0.0'`);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` decimal(3,1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` decimal(2,1) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`properties\` DROP COLUMN \`rating\``);
        await queryRunner.query(`ALTER TABLE \`properties\` DROP COLUMN \`star\``);
    }

}
