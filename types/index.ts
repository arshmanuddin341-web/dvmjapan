export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: {
    fob: number;
    cif?: number;
    currency: string;
  };
  engine: {
    displacement: string;
    type: string;
    fuel: string;
  };
  transmission: string;
  mileage: number;
  color: string;
  auctionGrade?: string;
  condition?: string;
  images: string[];
  location: string;
  stockId: string;
  features: string[];
  description: string;
  bodyType?: string;
  driveType?: string;
  engineSize?: number;
  auctionSheet?: string;
  inspectionReport?: string;
  chassis?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
  category: string;
  tags: string[];
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  description: string;
  importRequirements: string[];
  shippingTime: string;
  popularModels: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  vehicle: string;
  rating: number;
  comment: string;
  date: string;
  image?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleId?: string;
  message: string;
  status: "new" | "contacted" | "resolved";
  createdAt: string;
}
