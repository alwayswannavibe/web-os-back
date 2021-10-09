// Common
import { CustomError } from '@app/common/enums/customError.enum';

export class CoreResponse {
  error?: CustomError;

  isSuccess: boolean;
}
