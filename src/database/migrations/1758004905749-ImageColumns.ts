import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImageColumns1758004905749 implements MigrationInterface {
  name = 'ImageColumns1758004905749';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_info\` ADD \`avatar\` varchar(255) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`rooms\` ADD \`images\` text NULL`);
    await queryRunner.query(
      `ALTER TABLE \`properties\` ADD \`images\` text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`properties\` DROP COLUMN \`images\``,
    );
    await queryRunner.query(`ALTER TABLE \`rooms\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`user_info\` DROP COLUMN \`avatar\``);
  }
}
