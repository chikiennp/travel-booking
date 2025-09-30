import { MigrationInterface, QueryRunner } from "typeorm";

export class Paymenttable1759139079190 implements MigrationInterface {
    name = 'Paymenttable1759139079190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4e5a0c45eda01b884c83856152\` ON \`booking_info\``);
        await queryRunner.query(`ALTER TABLE \`booking_info\` CHANGE \`firstName\` \`firstName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_info\` CHANGE \`lastName\` \`lastName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_info\` CHANGE \`phone\` \`phone\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booking_info\` CHANGE \`phone\` \`phone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_info\` CHANGE \`lastName\` \`lastName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_info\` CHANGE \`firstName\` \`firstName\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4e5a0c45eda01b884c83856152\` ON \`booking_info\` (\`email\`)`);
    }

}
