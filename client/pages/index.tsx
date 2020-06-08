import Shop from "../helpers/Shop";
import { useEffect, useState } from "react";

const HomePage = () => {
  const shop = new Shop({ category: "Standard Gear" });
  const [inventory, setInventory] = useState(shop.inventory);
  return (
    <div>
      <span>Welcome to my misc shop! We have:</span>
      <ul>
        {inventory.map((item) => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
      <button onClick={() => void setInventory(shop.randomizeInventory())}>
        Randomize Items
      </button>
    </div>
  );
};

export default HomePage;
