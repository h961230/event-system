import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Headers,
  ParseIntPipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventReqDto } from './dto/createEventReqDto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(
    @Body() dto: CreateEventReqDto,
    @Headers('x-user-email') userEmail: string,
  ) {
    const event = await this.eventService.createEvent({
      ...dto,
      createdBy: userEmail,
    });
    return { event: event };
  }

  @Get()
  getEvents() {
    return this.eventService.getAllEvents();
  }

  @Get(':eventId')
  getEvent(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.eventService.getEventById(eventId);
  }

  @Patch('state')
  updateEventState(@Body() body: { eventId: number; state: string }) {
    return this.eventService.updateEventState(body.eventId, body.state);
  }
}
