import { Injectable } from '@nestjs/common';
import { KavenegarApi } from 'kavenegar';

@Injectable()
export class SmsService {
  api = KavenegarApi({
    apikey: 'put your API Token here',
  });

  public sendRegisterAuthCodeSMS(phoneNumber: string, GenCode: string) {
    this.api.VerifyLookup({
      receptor: phoneNumber,
      token: GenCode,
      template: 'prod-login-code',
    });
  }
}
