import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1757403091679 implements MigrationInterface {
    name = 'InitTables1757403091679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booking_items\` CHANGE \`price\` \`pricePerNight\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_draft_items\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`booking_draft_items\` DROP COLUMN \`nights\``);
        await queryRunner.query(`ALTER TABLE \`booking_draft_items\` DROP COLUMN \`subTotal\``);
        await queryRunner.query(`ALTER TABLE \`booking_draft_items\` ADD \`pricePerNight\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_items\` CHANGE \`pricePerNight\` \`pricePerNight\` decimal(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booking_items\` CHANGE \`pricePerNight\` \`pricePerNight\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_draft_items\` DROP COLUMN \`pricePerNight\``);
        await queryRunner.query(`ALTER TABLE \`booking_draft_items\` ADD \`subTotal\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_draft_items\` ADD \`nights\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_draft_items\` ADD \`price\` decimal NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_items\` CHANGE \`pricePerNight\` \`price\` decimal NOT NULL`);
    }

}
