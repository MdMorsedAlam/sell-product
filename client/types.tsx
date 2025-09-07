export interface IProduct {
  _id: string;
  name: string;
  title: string;
  subTitle: string;
  description: string;
  buttonText: string;
  imageUrl: string;
  gift: string;
  price: string;
  offerPrice: string;
  problem: string;
  problemSolving: string;
  solutions: string[];
  eatProduct: string;
  useProduct: string;
  reviews: string[];
  contactNumber: string[];
}

export interface IOrder {
  _id?: string;
  name: string;
  address: string;
  phone: string;
  status: string;
  product: string; // reference to Product
  totalPrice: string;
  orderDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
