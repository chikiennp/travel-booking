import { MigrationInterface, QueryRunner } from "typeorm";

export class Fixdatabase1758535302125 implements MigrationInterface {
    name = 'Fixdatabase1758535302125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD \`propertyId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_ce3e5c454b2ff702244f7318828\` FOREIGN KEY (\`propertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_ce3e5c454b2ff702244f7318828\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP COLUMN \`propertyId\``);
    }

}
