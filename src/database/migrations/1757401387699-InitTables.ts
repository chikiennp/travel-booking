import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1757401387699 implements MigrationInterface {
  name = 'InitTables1757401387699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`reviews\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`rating\` decimal(2,1) NOT NULL, \`comment\` text NULL, \`userId\` int NULL, \`propertyId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`rooms\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`price\` decimal(10,2) NOT NULL, \`capacity\` int NOT NULL, \`features\` text NULL, \`status\` enum ('available', 'booked', 'maintenance') NOT NULL DEFAULT 'available', \`propertyId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`booking_items\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL DEFAULT '1', \`price\` decimal(10,2) NOT NULL, \`nights\` int NOT NULL, \`subTotal\` decimal(10,2) NOT NULL, \`bookingId\` int NULL, \`roomId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bookings\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`checkIn\` date NOT NULL, \`checkOut\` date NOT NULL, \`guestCount\` int NOT NULL, \`totalPrice\` decimal(10,2) NOT NULL DEFAULT '0.00', \`status\` enum ('pending', 'confirmed', 'canceled', 'completed') NOT NULL DEFAULT 'pending', \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`booking_draft_items\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL DEFAULT '1', \`price\` decimal(10,2) NULL, \`nights\` int NOT NULL, \`subTotal\` decimal(10,2) NOT NULL, \`draftId\` int NULL, \`roomId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`booking_drafts\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`checkIn\` date NULL, \`checkOut\` date NULL, \`guestCount\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`properties\` ADD \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`properties\` ADD \`address\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`properties\` ADD \`description\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`properties\` ADD \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`properties\` ADD \`hostId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_7ed5659e7139fc8bc039198cc1f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_2c75ccf95bf502363885d076e76\` FOREIGN KEY (\`propertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_ce3e5c454b2ff702244f7318828\` FOREIGN KEY (\`propertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_ce3e5c454b2ff702244f7318828\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_2c75ccf95bf502363885d076e76\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_7ed5659e7139fc8bc039198cc1f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`properties\` DROP COLUMN \`hostId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`properties\` DROP COLUMN \`status\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`properties\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`properties\` DROP COLUMN \`address\``,
    );
    await queryRunner.query(`ALTER TABLE \`properties\` DROP COLUMN \`name\``);
    await queryRunner.query(`DROP TABLE \`booking_drafts\``);
    await queryRunner.query(`DROP TABLE \`booking_draft_items\``);
    await queryRunner.query(`DROP TABLE \`bookings\``);
    await queryRunner.query(`DROP TABLE \`booking_items\``);
    await queryRunner.query(`DROP TABLE \`rooms\``);
    await queryRunner.query(`DROP TABLE \`reviews\``);
  }
}
