import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Headers,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventReqDto } from './dto/createEventReqDto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  private logger = new Logger();

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
  async getEvents() {
    return this.eventService.getAllEvents();
  }

  @Get(':eventId')
  async getEvent(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.eventService.getEventById(eventId);
  }

  @Patch('state')
  updateEventState(@Body() body: { eventId: number; state: string }) {
    this.logger.log({ body: body });
    return this.eventService.updateEventState(body.eventId, body.state);
  }
}
