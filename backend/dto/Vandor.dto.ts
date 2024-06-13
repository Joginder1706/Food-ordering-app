export interface CreateVandorInput {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginVandorInput {
  email: string;
  password: string;
}

export interface VandorPayload {
  _id: string;
  email: string;
  password: string;
  foodTypes: [string];
}

export interface EditVandor {
  name: string;
  address: string;
  phone: string;
  foodTypes: [string];
}
