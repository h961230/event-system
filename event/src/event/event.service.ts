import {
  Injectable,
  Logger,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './event.schema';
import { CreateEventReqDto } from './dto/createEventReqDto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
  ) {}
  private logger = new Logger();

  async createEvent(dto: CreateEventReqDto) {
    const eventId = dto.eventId;
    const existing = await this.eventModel.findOne({ eventId });
    if (existing) {
      throw new ConflictException('이미 등록된 이벤트 Id 입니다.');
    }
    return this.eventModel.create(dto);
  }

  async getAllEvents() {
    return this.eventModel.find();
  }

  async getEventById(eventId: number) {
    const eventInfo = await this.eventModel.findOne({ eventId });
    if (!eventInfo) {
      throw new ConflictException('존재하지 않는 이벤트 입니다.');
    }
    return eventInfo;
  }

  async updateEventState(eventId: number, state: string) {
    const event = await this.eventModel.findOne({ eventId });

    this.logger.log({ event: event });
    if (!event) {
      throw new BadRequestException('존재하지 않는 이벤트 입니다.');
    }

    return this.eventModel.findByIdAndUpdate(
      event._id,
      { state },
      { new: true },
    );
  }
}
