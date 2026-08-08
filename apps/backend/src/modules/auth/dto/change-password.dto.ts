import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'CurrentPass@123' })
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty({ example: 'NewSecurePass@123' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  newPassword!: string;
}
