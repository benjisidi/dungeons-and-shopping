import type { Shop, Response } from "shared-types";

export const getShopLookup = (data: Response<Shop>[]) =>
  data.reduce((acc: { [id: string]: string }, curr) => {
    const id: string = curr._id;
    acc[id] = curr.name;
    return acc;
  }, {});
