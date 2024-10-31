import { Controller, Post, Body, UseGuards, Req,Res, UnauthorizedException,Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtGuard } from './jwt-auth.guard';
import { UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(User.name) private userModel: Model<User>,
    private usersService: UsersService,
    private jwtService: JwtService

  ) { }
  


// Register
  @Post('register')
  async register(@Body() registerDto: SignUpDto) {
    return this.authService.register(registerDto);
  }

// Login
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    try{
    const user = await this.authService.login(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    response.cookie('user_token', this.jwtService.sign(user,{ noTimestamp: true }))
      response.send({ message: 'Login successful' });
    } catch (error) {
      console.log(error)
      throw new UnauthorizedException('Invalid user');
    }
  }


  // Logout
  @Get('logout')
  async logout(@Res({ passthrough: true }) res) {
    try { 
    res.cookie('user_token', '', { expires: new Date(Date.now()) });
    return {message: 'Logout successful'};
    } catch (error) { 
      throw new UnauthorizedException('Invalid user');
    }
  }



  // Get user info
  @UseGuards(JwtGuard)
  @Get("me")
  getMe(@Req() req) {
    try {
      console.log(req.cookies.user_token);
      return this.authService.getUserInfo(req.cookies.user_token);
    } catch (error) {
      throw new UnauthorizedException('Invalid user');
    }
  }
}