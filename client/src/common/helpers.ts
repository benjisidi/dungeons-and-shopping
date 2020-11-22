import type { ShopModel } from "../../../types";

export const getShopLookup = (data: ShopModel[]) =>
  data.reduce((acc: { [id: string]: string }, curr) => {
    const id: string = curr._id;
    acc[id] = curr.name;
    return acc;
  }, {});
