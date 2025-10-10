import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChatTables1759916666239 implements MigrationInterface {
    name = 'AddChatTables1759916666239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_b249105d1314958ae8244bb403\` ON \`chat_rooms\` (\`clientId\`, \`hostId\`, \`status\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b249105d1314958ae8244bb403\` ON \`chat_rooms\``);
    }

}
