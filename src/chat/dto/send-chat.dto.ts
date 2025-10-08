import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  MaxLength,
  MinLength,
  IsUUID,
} from 'class-validator';

export class SendChatDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  senderId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @IsBoolean()
  isGuest: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  senderName?: string;

  @IsUUID('4')
  @IsOptional()
  chatRoomId?: string;

  @IsUUID('4')
  @IsOptional()
  hostId?: string;
}
