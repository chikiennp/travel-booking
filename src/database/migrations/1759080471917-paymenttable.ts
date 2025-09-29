import { MigrationInterface, QueryRunner } from "typeorm";

export class Paymenttable1759080471917 implements MigrationInterface {
    name = 'Paymenttable1759080471917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_506ad0383e86abe7ff554eb481\` ON \`bookings\``);
        await queryRunner.query(`CREATE TABLE \`payments\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`amount\` decimal(12,2) NOT NULL, \`currency\` varchar(10) NOT NULL DEFAULT 'VND', \`status\` enum ('pending', 'paid', 'failed', 'canceled', 'refunded') NOT NULL DEFAULT 'pending', \`paymentMethod\` varchar(50) NOT NULL, \`transactionId\` varchar(100) NULL, \`booking_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_e86edf76dc2424f123b9023a2b2\` FOREIGN KEY (\`booking_id\`) REFERENCES \`bookings\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_e86edf76dc2424f123b9023a2b2\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_506ad0383e86abe7ff554eb481\` ON \`bookings\` (\`infoId\`)`);
    }

}
