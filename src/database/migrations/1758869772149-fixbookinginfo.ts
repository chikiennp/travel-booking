import { MigrationInterface, QueryRunner } from 'typeorm';

export class Fixbookinginfo1758869772149 implements MigrationInterface {
  name = 'Fixbookinginfo1758869772149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`booking_info\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`phone\` varchar(255) NULL, UNIQUE INDEX \`IDX_4e5a0c45eda01b884c83856152\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`user_info\` DROP COLUMN \`email\``);
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD \`infoId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD UNIQUE INDEX \`IDX_506ad0383e86abe7ff554eb481\` (\`infoId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_506ad0383e86abe7ff554eb481\` ON \`bookings\` (\`infoId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_506ad0383e86abe7ff554eb481c\` FOREIGN KEY (\`infoId\`) REFERENCES \`booking_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_506ad0383e86abe7ff554eb481c\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_506ad0383e86abe7ff554eb481\` ON \`bookings\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` DROP INDEX \`IDX_506ad0383e86abe7ff554eb481\``,
    );
    await queryRunner.query(`ALTER TABLE \`bookings\` DROP COLUMN \`infoId\``);
    await queryRunner.query(
      `ALTER TABLE \`user_info\` ADD \`email\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4e5a0c45eda01b884c83856152\` ON \`booking_info\``,
    );
    await queryRunner.query(`DROP TABLE \`booking_info\``);
  }
}
