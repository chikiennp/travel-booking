import { MigrationInterface, QueryRunner } from "typeorm";

export class AddForgotPass1760347414230 implements MigrationInterface {
    name = 'AddForgotPass1760347414230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`resetToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`resetTokenExpiry\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`resetTokenExpiry\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`resetToken\``);
    }

}
