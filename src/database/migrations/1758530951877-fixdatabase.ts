import { MigrationInterface, QueryRunner } from 'typeorm';

export class Fixdatabase1758530951877 implements MigrationInterface {
  name = 'Fixdatabase1758530951877';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` varchar(36) NOT NULL, \`role\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, UNIQUE INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\` (\`role\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`reviews\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`rating\` decimal(2,1) NOT NULL, \`comment\` text NULL, \`userId\` varchar(36) NULL, \`propertyId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`rooms\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`roomNumber\` varchar(255) NOT NULL, \`price\` decimal(10,2) NOT NULL, \`beds\` json NULL, \`features\` text NULL, \`status\` enum ('available', 'booked', 'maintenance') NOT NULL DEFAULT 'available', \`images\` text NULL, \`roomTypeId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`room_types\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`beds\` json NULL, \`capacity\` int NOT NULL, \`description\` text NULL, \`images\` text NULL, \`propertyId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`properties\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`description\` text NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`images\` text NULL, \`hostId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`booking_items\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`quantity\` int NOT NULL DEFAULT '1', \`pricePerNight\` decimal(10,2) NOT NULL, \`nights\` int NOT NULL, \`subTotal\` decimal(10,2) NOT NULL, \`bookingId\` varchar(36) NULL, \`roomId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bookings\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`checkIn\` date NOT NULL, \`checkOut\` date NOT NULL, \`guestCount\` int NOT NULL, \`totalPrice\` decimal(10,2) NOT NULL DEFAULT '0.00', \`status\` enum ('pending', 'confirmed', 'canceled', 'completed') NOT NULL DEFAULT 'pending', \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`booking_draft_items\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`quantity\` int NOT NULL DEFAULT '1', \`pricePerNight\` decimal(10,2) NOT NULL, \`draftId\` varchar(36) NULL, \`roomId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`booking_drafts\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`checkIn\` date NULL, \`checkOut\` date NULL, \`guestCount\` int NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`lastLogin\` timestamp NULL, \`infoId\` varchar(36) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`REL_74e49ef096dd8207ae49d4a3d2\` (\`infoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_info\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`address\` varchar(255) NULL, \`preferences\` json NULL, \`avatar\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_roles\` (\`userId\` varchar(36) NOT NULL, \`roleId\` varchar(36) NOT NULL, INDEX \`IDX_472b25323af01488f1f66a06b6\` (\`userId\`), INDEX \`IDX_86033897c009fcca8b6505d6be\` (\`roleId\`), PRIMARY KEY (\`userId\`, \`roleId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_7ed5659e7139fc8bc039198cc1f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_2c75ccf95bf502363885d076e76\` FOREIGN KEY (\`propertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_76b20e23154532d6fc4a0f0ea27\` FOREIGN KEY (\`roomTypeId\`) REFERENCES \`room_types\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`room_types\` ADD CONSTRAINT \`FK_87fb8deb24d530cc703c6800798\` FOREIGN KEY (\`propertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`properties\` ADD CONSTRAINT \`FK_97ae9ee8402b8d8d167fa7352ce\` FOREIGN KEY (\`hostId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_items\` ADD CONSTRAINT \`FK_13671e33965ca9dca96bd3c733e\` FOREIGN KEY (\`bookingId\`) REFERENCES \`bookings\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_items\` ADD CONSTRAINT \`FK_6ee62f52377843ef9d203cfc05e\` FOREIGN KEY (\`roomId\`) REFERENCES \`rooms\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_38a69a58a323647f2e75eb994de\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_draft_items\` ADD CONSTRAINT \`FK_e0b9fddb0f1ebc0ade9e8833bed\` FOREIGN KEY (\`draftId\`) REFERENCES \`booking_drafts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_draft_items\` ADD CONSTRAINT \`FK_bdb1c6ec316da47b293390ded95\` FOREIGN KEY (\`roomId\`) REFERENCES \`rooms\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_drafts\` ADD CONSTRAINT \`FK_6d8ea38a25caec358be1eb00d28\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_74e49ef096dd8207ae49d4a3d29\` FOREIGN KEY (\`infoId\`) REFERENCES \`user_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_472b25323af01488f1f66a06b67\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_86033897c009fcca8b6505d6be2\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_86033897c009fcca8b6505d6be2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_472b25323af01488f1f66a06b67\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_74e49ef096dd8207ae49d4a3d29\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_drafts\` DROP FOREIGN KEY \`FK_6d8ea38a25caec358be1eb00d28\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_draft_items\` DROP FOREIGN KEY \`FK_bdb1c6ec316da47b293390ded95\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_draft_items\` DROP FOREIGN KEY \`FK_e0b9fddb0f1ebc0ade9e8833bed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_38a69a58a323647f2e75eb994de\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_items\` DROP FOREIGN KEY \`FK_6ee62f52377843ef9d203cfc05e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_items\` DROP FOREIGN KEY \`FK_13671e33965ca9dca96bd3c733e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`properties\` DROP FOREIGN KEY \`FK_97ae9ee8402b8d8d167fa7352ce\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`room_types\` DROP FOREIGN KEY \`FK_87fb8deb24d530cc703c6800798\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_76b20e23154532d6fc4a0f0ea27\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_2c75ccf95bf502363885d076e76\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_7ed5659e7139fc8bc039198cc1f\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_86033897c009fcca8b6505d6be\` ON \`user_roles\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_472b25323af01488f1f66a06b6\` ON \`user_roles\``,
    );
    await queryRunner.query(`DROP TABLE \`user_roles\``);
    await queryRunner.query(`DROP TABLE \`user_info\``);
    await queryRunner.query(
      `DROP INDEX \`REL_74e49ef096dd8207ae49d4a3d2\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`booking_drafts\``);
    await queryRunner.query(`DROP TABLE \`booking_draft_items\``);
    await queryRunner.query(`DROP TABLE \`bookings\``);
    await queryRunner.query(`DROP TABLE \`booking_items\``);
    await queryRunner.query(`DROP TABLE \`properties\``);
    await queryRunner.query(`DROP TABLE \`room_types\``);
    await queryRunner.query(`DROP TABLE \`rooms\``);
    await queryRunner.query(`DROP TABLE \`reviews\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\` ON \`roles\``,
    );
    await queryRunner.query(`DROP TABLE \`roles\``);
  }
}
