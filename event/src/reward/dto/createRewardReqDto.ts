export class CreateRewardReqDto {
  rewardId: number;
  eventId: number;
  conditionIds?: number[];
  type: 'POINT' | 'ITEM' | 'COUPON';
  name: string;
  quantity: number;
}
