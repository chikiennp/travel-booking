import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChatTables1759748334559 implements MigrationInterface {
  name = 'AddChatTables1759748334559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`chats\` (\`id\` varchar(36) NOT NULL, \`content\` text NOT NULL, \`senderId\` varchar(255) NOT NULL, \`senderName\` varchar(255) NULL, \`isGuest\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`chatRoomId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`chat_rooms\` (\`id\` varchar(36) NOT NULL, \`hostId\` varchar(255) NULL, \`clientId\` varchar(255) NOT NULL, \`isGuest\` tinyint NOT NULL DEFAULT 0, \`status\` enum ('open', 'closed') NOT NULL DEFAULT 'open', \`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chats\` ADD CONSTRAINT \`FK_619612ba3782760c4038db9656c\` FOREIGN KEY (\`chatRoomId\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chats\` DROP FOREIGN KEY \`FK_619612ba3782760c4038db9656c\``,
    );
    await queryRunner.query(`DROP TABLE \`chat_rooms\``);
    await queryRunner.query(`DROP TABLE \`chats\``);
  }
}
