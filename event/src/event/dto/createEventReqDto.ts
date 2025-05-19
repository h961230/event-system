export class CreateEventReqDto {
  eventId: number;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  createdBy: string;
}
