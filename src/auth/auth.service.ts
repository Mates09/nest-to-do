import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../user/user.service';
import * as jwt from 'jsonwebtoken';
import { decode } from 'punycode';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>

  ) { }

  // Register
  async register(registerDto: SignUpDto) {
    try { 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);
    const newUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });
  
      return newUser.save();
    } catch (error) {
      console.log(error)
     }
  }


  
// Validate user
  async validateUser(email: string, password: string): Promise<any> {
    try { 
    const user = await this.usersService.findByEmail(email);
    
    // Check if the user exists
    if (!user) {
      console.log("User not found");
      return null;
    }
   
    // Compare the input password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password); 
    if (isMatch) {
      console.log("password match")
      user.password = undefined;
      return {user};
    }
  
      return null;
    } catch (error) {
      console.log(error)
     }
  }


  // Login
  async login(loginDto: LoginDto) {
    try { 
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
      return user
    } catch (error) {
      console.log(error)
     }
  }

  // Get user info  
  async getUserInfo(cookie: string) {
    try { 
    const decoded = jwt.verify(cookie.toString(), "secretKey");
      return decoded 
    } catch (error) {
      console.log(error)
     }
  }



}