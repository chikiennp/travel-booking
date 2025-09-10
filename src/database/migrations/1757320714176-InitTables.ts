import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1757320714176 implements MigrationInterface {
  name = 'InitTables1757320714176';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, UNIQUE INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\` (\`role\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`lastLogin\` timestamp NULL, \`infoId\` int NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`REL_74e49ef096dd8207ae49d4a3d2\` (\`infoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_info\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`address\` varchar(255) NULL, \`preferences\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`properties\` (\`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`updatedBy\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_roles\` (\`userId\` int NOT NULL, \`roleId\` int NOT NULL, INDEX \`IDX_472b25323af01488f1f66a06b6\` (\`userId\`), INDEX \`IDX_86033897c009fcca8b6505d6be\` (\`roleId\`), PRIMARY KEY (\`userId\`, \`roleId\`)) ENGINE=InnoDB`,
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
      `DROP INDEX \`IDX_86033897c009fcca8b6505d6be\` ON \`user_roles\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_472b25323af01488f1f66a06b6\` ON \`user_roles\``,
    );
    await queryRunner.query(`DROP TABLE \`user_roles\``);
    await queryRunner.query(`DROP TABLE \`properties\``);
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
    await queryRunner.query(
      `DROP INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\` ON \`roles\``,
    );
    await queryRunner.query(`DROP TABLE \`roles\``);
  }
}
