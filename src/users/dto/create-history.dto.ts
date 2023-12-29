import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty()
  readonly idUser: string;

  @IsString()
  @IsNotEmpty()
  readonly idProduct: string;
}
