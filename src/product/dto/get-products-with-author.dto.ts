import { IsString } from 'class-validator';
import { GetProductDto } from './get-product.dto';

export class GetProductsWithAuthorDto extends GetProductDto {
  @IsString()
  id_author: number;

  @IsString()
  name_author: string;

  @IsString()
  birth_date_author: string;

  @IsString()
  nacionality_author: string;

  @IsString()
  biography_author: string;

  @IsString()
  image_author: string;

  @IsString()
  slug_author: string;
  
  @IsString()
  created_at_author: string;

  @IsString()
  id_category: number;

  @IsString()
  category_product: string;

  @IsString()
  description_category: string;
}
