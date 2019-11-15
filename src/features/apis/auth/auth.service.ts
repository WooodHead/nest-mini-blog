import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import config from '../../../config'
import { UserEntity } from '../../entities/user.entity'
import { IToken } from '../../interfaces/auth.interface'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  createToken(mobilePhoneNumber: string): IToken {
    const accessToken = this.jwtService.sign({ mobilePhoneNumber })

    return {
      expires_in: config.jwt.signOptions.expiresIn,
      access_token: accessToken,
    }
  }
}
