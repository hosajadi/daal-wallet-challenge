import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserAuthService } from './user-auth.service';
import { UserAuth } from '../../common/models/user-auth.model';
import { Token } from '../../common/models/token.model';
import { LoginWithCodeInput, LoginWithPasswordInput } from './dto/loginWithPasswordInput';
import { UserSignupInputDto } from './dto/user-signup.input.dto';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { User } from '../../common/models/user.model';
import { RegisteredStatus, SignupCheckoutResponse } from '../../common/generalCustomResponses/signup-checkout.response';
import { PasswordService } from './password.service';
import { BasicResponse } from '../../common/generalCustomResponses/basic-response.model';
import { SmsService } from '../../common/commonServices/sms.service';
import { NestConfig } from '../../common/configs/config.interface';
import { ConfigService } from '@nestjs/config';
@Resolver(() => UserAuth)
export class UserAuthResolver {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly passwordService: PasswordService,
    private readonly smsService: SmsService,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => SignupCheckoutResponse)
  async signupCheckOut(
    @Args('phoneNumber', { type: () => String, nullable: false })
    phoneNumber: string,
  ): Promise<SignupCheckoutResponse> {
    const userExistence = await this.userAuthService.checkUserExistence(phoneNumber);
    if (userExistence.registeredStatus === RegisteredStatus.registeredWithCode) {
      let randomNumber: string;
      if (
        (this.configService.get<NestConfig>('nest').env === 'localhost' ||
          this.configService.get<NestConfig>('nest').env === 'stage') &&
        phoneNumber.slice(0, 7) === '0900000'
      ) {
        randomNumber = '11111';
      } else {
        randomNumber = this.passwordService.generateRandomCode(5);
      }
      await this.userAuthService.setCodeToCache(phoneNumber, randomNumber);
      this.smsService.sendRegisterAuthCodeSMS(phoneNumber, randomNumber);
    }
    return userExistence;
  }

  @Mutation(() => SignupCheckoutResponse)
  async registerASignup(@Args('data') data: UserSignupInputDto): Promise<SignupCheckoutResponse> {
    const randomCode = await this.userAuthService.createUserInCache(data);
    const resp = new SignupCheckoutResponse();
    resp.registeredStatus = RegisteredStatus.registeredWithCode;
    // this.smsService.sendRegisterAuthCodeSMS(data.phoneNumber, randomCode);
    return resp;
  }

  @Mutation(() => UserAuth)
  async signupWithCode(@Args('data') { phoneNumber, code }: LoginWithCodeInput) {
    const { accessToken, refreshToken } = await this.userAuthService.signupWithCode(phoneNumber, code);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => UserAuth)
  async loginWithPassword(@Args('data') { phoneNumber, password }: LoginWithPasswordInput) {
    const { accessToken, refreshToken } = await this.userAuthService.loginWithPassword(phoneNumber, password);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => BasicResponse)
  async loginCheckoutWithCode(
    @Args('phoneNumber', { type: () => String, nullable: false }) phoneNumber: string,
  ): Promise<BasicResponse> {
    await this.userAuthService.loginCheckoutWithCode(phoneNumber);
    const resp = new BasicResponse();
    resp.id = 200;
    resp.status = 'OK';
    return resp;
  }

  @Mutation(() => UserAuth)
  async loginWithCode(@Args('data') { phoneNumber, code }: LoginWithCodeInput) {
    const { accessToken, refreshToken } = await this.userAuthService.loginWithCode(phoneNumber, code);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.userAuthService.refreshToken(token);
  }

  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return this.userAuthService.getAllUsers();
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: UserAuth) {
    return await this.userAuthService.getUserFromToken(auth.accessToken);
  }
}
