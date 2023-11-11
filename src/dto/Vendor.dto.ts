export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodType: string;
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  lat: string;
  lng: string;
}

export interface VendorLoginInput {
  email: string;
  password: string;
}

export interface VendorPayload {
  _id: string;
  status: string;
}

export interface EditVendorInput {
  name: string;
  address: string;
  phone: string;
  ownerName: string;
}

export interface CreateOfferInput {
  offerType: string;
  vendors: [any];
  title: string;
  description: string;
  minValue: number;
  offerAmount: number;
  startValidity: Date;
  endValidity: Date;
  promocode: string;
  promoType: string;
  bank: [any];
  bins: [any];
  pincode: string;
  isActive: boolean;
}
