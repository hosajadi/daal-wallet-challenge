import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';

function errorFormatter(
  code: ApolloServerErrorCode,
  type: string,
  englishMessage: string,
  persianMessage: string,
): GraphQLError {
  return new GraphQLError(type, {
    extensions: {
      code: code,
      englishMessage: englishMessage,
      persianMessage: persianMessage,
    },
  });
}

export const errorTypes = {
  users: {
    USER_ALREADY_REGISTERED: (code?: ApolloServerErrorCode) =>
      errorFormatter(
        code ?? ApolloServerErrorCode.BAD_REQUEST,
        'user.USERNAME_ALREADY_REGISTERED',
        'user already is registered',
        'حساب کاربری با این شماره تلفن از قبل ثبت شده است',
      ),
    USER_NOT_FOUND: (code?: ApolloServerErrorCode, phoneNumber?: string | null) => {
      return errorFormatter(
        code ?? ApolloServerErrorCode.PERSISTED_QUERY_NOT_FOUND,
        'user.USER_NOT_FOUND',
        phoneNumber ? `User with phone number ${phoneNumber} not Found` : 'User not found',
        phoneNumber ? `اطلاعات حساب کاربری با شماره ${phoneNumber} وجود ندارد` : 'اطلاعات حساب کاربری وجود ندارد',
      );
    },
    USER_INVALID_PASSWORD: (code?: ApolloServerErrorCode) =>
      errorFormatter(
        code ?? ApolloServerErrorCode.BAD_USER_INPUT,
        'user.USER_INVALID_PASSWORD',
        'The provided password is Invalid',
        'گذرواژه وارد شده اشتباه است',
      ),
    USER_DOES_NOT_SET_PASSWORD: (code?: ApolloServerErrorCode) =>
      errorFormatter(
        code ?? ApolloServerErrorCode.BAD_USER_INPUT,
        'user.USER_DOES_NOT_SET_PASSWORD',
        'The user does not set any password!',
        'کاربر گذرواژه ای انتخاب نکرده است!',
      ),
    USER_SUBMIT_CODE_TIME_OUT: (code?: ApolloServerErrorCode) => {
      return errorFormatter(
        code ?? ApolloServerErrorCode.BAD_USER_INPUT,
        'user.USER_SUBMIT_CODE_TIME_OUT',
        'The code has Expired',
        'کد منقضی شده است',
      );
    },
    USER_SUBMIT_INVALID_CODE: (code?: ApolloServerErrorCode) =>
      errorFormatter(
        code ?? ApolloServerErrorCode.BAD_USER_INPUT,
        'user.USER_SUBMIT_INVALID_CODE',
        'The entered code is invalid',
        'کد وارد شده صحیح نمیباشد',
      ),
    USER_NOT_ALLOWED_TO_CHANGE_PASS: (code?: ApolloServerErrorCode) =>
      errorFormatter(
        code ?? ApolloServerErrorCode.BAD_USER_INPUT,
        'user.USER_NOT_ALLOWED_TO_CHANGE_PASS',
        'The provided phone number do not belong to you',
        'شماره وارد شده متعلق به شما نیست',
      ),
    USER_ALREADY_SET_PASS: (code?: ApolloServerErrorCode) =>
      errorFormatter(
        code ?? ApolloServerErrorCode.BAD_USER_INPUT,
        'user.USER_ALREADY_SET_PASS',
        'The current user already has password',
        'برای این کاربر از قبل گذرواژه ست شده است',
      ),
    DESIGNER_ALREADY_IS_FAVORITE: (code?: ApolloServerErrorCode) =>
      errorFormatter(
        code ?? ApolloServerErrorCode.BAD_REQUEST,
        'user.DESIGNER_ALREADY_IS_FAVORITE',
        'user already is favorite',
        'از قبل در لیست علاقه مندی ها وجود دارد!',
      ),
    DESIGNER_IS_NOT_FAVORITE: (code?: ApolloServerErrorCode) =>
      errorFormatter(
        code ?? ApolloServerErrorCode.BAD_REQUEST,
        'user.DESIGNER_IS_NOT_FAVORITE',
        'user is not favorite',
        'در لیست علاقه مندی ها وجود ندارد',
      ),
  },
  password: {
    INVALID_PASSWORD: (code?: ApolloServerErrorCode) =>
      errorFormatter(
        code ?? ApolloServerErrorCode.BAD_USER_INPUT,
        'password.INVALID_PASSWORD',
        'The password is invalid',
        'گذرواژه نادرست است.',
      ),
  },
  payment: {
    PAYMENT_AMOUNT_NOT_MATCHED: (code?: ApolloServerErrorCode) => {
      return errorFormatter(
        code ?? ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
        'payment.PAYMENT_AMOUNT_NOT_MATCHED',
        'The amount does not match',
        'قیمت ارسال شده درست نمی باشد',
      );
    },
    TRANSACTION_NOT_FOUND: (code?: ApolloServerErrorCode) => {
      return errorFormatter(
        code ?? ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
        'payment.TRANSACTION_NOT_FOUND',
        'The transaction not found',
        'تراکنش مورد نظر پیدا نشد',
      );
    },
  },
};
