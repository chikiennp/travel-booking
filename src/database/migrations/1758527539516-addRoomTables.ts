import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoomTables1758527539516 implements MigrationInterface {
    name = 'AddRoomTables1758527539516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_ce3e5c454b2ff702244f7318828\``);
        await queryRunner.query(`CREATE TABLE \`room_types\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` int NULL, \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`beds\` json NULL, \`capacity\` int NOT NULL, \`description\` text NULL, \`images\` text NULL, \`propertyId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP COLUMN \`capacity\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP COLUMN \`propertyId\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD \`roomNumber\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD \`beds\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD \`roomTypeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_76b20e23154532d6fc4a0f0ea27\` FOREIGN KEY (\`roomTypeId\`) REFERENCES \`room_types\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_types\` ADD CONSTRAINT \`FK_87fb8deb24d530cc703c6800798\` FOREIGN KEY (\`propertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room_types\` DROP FOREIGN KEY \`FK_87fb8deb24d530cc703c6800798\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_76b20e23154532d6fc4a0f0ea27\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP COLUMN \`roomTypeId\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP COLUMN \`beds\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP COLUMN \`roomNumber\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD \`type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD \`propertyId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD \`capacity\` int NOT NULL`);
        await queryRunner.query(`DROP TABLE \`room_types\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_ce3e5c454b2ff702244f7318828\` FOREIGN KEY (\`propertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
