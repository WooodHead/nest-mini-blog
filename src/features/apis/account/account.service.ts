import { compareSync, hashSync } from 'bcryptjs'
import { SignInDto } from 'src/features/dtos/signIn.dto'
import { BusinessErrorStatus } from 'src/features/enums'
import { Repository } from 'typeorm'

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'

import { SignUpDto } from '../../dtos/signUp.dto'
import { UserEntity } from '../../entities/user.entity'
import { IToken } from '../../interfaces/auth.interface'
import { AuthService } from '../auth/auth.service'
import { UserService } from '../user/user.service'

@Injectable()
export class AccountService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signIn(signInDto: SignInDto): Promise<IToken | UserEntity> {
    const user = await this.userService.getUserByMobilePhoneNumber(
      signInDto.mobilePhoneNumber,
    )

    if (!user) {
      throw new UnauthorizedException({
        message: '用户不存在',
        status: BusinessErrorStatus.DUPLICATE_PHONE,
      })
    }

    const { password, ...rest } = user

    if (!compareSync(signInDto.password, password)) {
      throw new UnauthorizedException({
        message: '密码错误',
        status: BusinessErrorStatus.DUPLICATE_PHONE,
      })
    }

    const token = this.authService.createToken(signInDto.mobilePhoneNumber)

    return { ...token, ...rest }
  }

  async signUp(signUpDto: SignUpDto): Promise<any> {
    // 校验手机号和用户名
    const user = await this.userService.getUserByMobilePhoneNumber(
      signUpDto.mobilePhoneNumber,
    )

    if (user) {
      throw new BadRequestException({
        message: '手机号重复',
        status: BusinessErrorStatus.DUPLICATE_PHONE,
      })
    }

    const user2 = await this.userService.getUserByUsername(signUpDto.username)

    if (user2) {
      throw new BadRequestException({
        message: '用户名重复',
        status: BusinessErrorStatus.DUPLICATE_USERNAME,
      })
    }

    await this.userRepository.save({
      ...signUpDto,
      password: hashSync(signUpDto.password, 10),
    })
  }
}
