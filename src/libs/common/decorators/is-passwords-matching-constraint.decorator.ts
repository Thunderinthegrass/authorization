import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
  // Метод validate получает значение текущего поля (passwordRepeat)
  // и объект со всеми полями DTO (args.object)
  validate(passwordRepeat: string, args: ValidationArguments) {
    const obj = args.object as Record<string, unknown>;

    // Сравниваем passwordRepeat с password
    return obj.password === passwordRepeat;
  }

  // Сообщение по умолчанию, если валидация не пройдена
  defaultMessage(args: ValidationArguments) {
    return 'Пароли не совпадают';
  }
}