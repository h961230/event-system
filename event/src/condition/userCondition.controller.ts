import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UserConditionService } from './userCondition.service';
import { CreateUserConditionReqDto } from './dto/createUserConditionReq.dto';

@Controller('condition')
export class UserConditionController {
  constructor(private readonly service: UserConditionService) {}

  @Post()
  upsert(@Body() dto: CreateUserConditionReqDto) {
    return this.service.createUserCondition(dto);
  }

  @Get()
  getAll(@Query('userEmail') userEmail: string) {
    return this.service.getUserConditions(userEmail);
  }
}
