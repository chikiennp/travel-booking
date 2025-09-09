import { Role } from '../enums/role.enum';

export interface JwtPayloadInterface {
  sub: number;
  username: string;
  roles: Role[];
}
