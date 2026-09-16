import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Ahmed Ali', description: 'Customer name' })
  name!: string;

  @ApiProperty({ example: 'ahmed@example.com', description: 'Email address' })
  email!: string;

  @ApiProperty({ example: '01012345678', description: 'Phone number' })
  phone!: string;
}
