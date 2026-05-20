export interface ColorVariant {
  _id: string;
  article: string;
  name: string;
  imageUrl: string;
}

export interface Fabric {
  _id: string;
  name: string;
  description: string;
  composition: string;
  width: string;
  density: string;
  price: number;
  priceUnit: string;
  currency: string;
  colors: ColorVariant[];
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface Contact {
  mapLink: string;
  mapFrameLink: string;
  max: string;
  _id: string;
  phone: string;
  phone2: string;
  email: string;
  address: string;
  workingHours: string;
  telegram: string;
  whatsapp: string;
  instagram: string;
  mapLat: number | null;
  mapLng: number | null;
}

export interface Certificate {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  issuedBy: string;
  year: string;
  order: number;
}
