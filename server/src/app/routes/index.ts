import express from "express";

import { UserRoutes } from "../modules/users/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ProductsRoutes } from "../modules/products/products.route";
import { OrdersRoutes } from "../modules/orders/orders.route";


const router = express.Router();

const modulesRoutes = [
  {
    path: "/users",
    module: UserRoutes,
  },
  {
    path: "/auth",
    module: AuthRoutes,
  },

  {
    path: "/products",
    module: ProductsRoutes,
  },
   {
    path: "/orders",
    module: OrdersRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.module));
export default router;
