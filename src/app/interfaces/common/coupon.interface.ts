export interface Coupon {
  _id?: string;
  name?: string;
  couponCode?: string;
  bannerImage?: string;
  description?: string;
  discountAmount?: number;
  discountType?: String;
  minimumAmount?: number;
  startDateTime?: Date;
  endDateTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
