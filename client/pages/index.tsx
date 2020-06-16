import Shop from "../helpers/Shop";
import React, { useEffect, useState } from "react";
import { Menu, Typography, Table } from "antd";

import styled from "styled-components";
const { Title } = Typography;
const navWidth = 300;

const Root = styled.div`
  display: flex;
`;

const NavMenu = styled(Menu)`
  width: ${navWidth}px;
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  padding: 8px 16px;
  flex-direction: column;
`;

const shops = [
  { name: "Arcane Armoury", category: "Armor" },
  { name: "Yaboi's General Store", category: "Kit" },
].map((x) => new Shop(x));

const HomePage = () => {
  const [curShop, setCurShop] = useState(0);
  const shop = shops[curShop];
  return (
    <Root>
      <NavMenu mode="inline" onClick={(e) => setCurShop(e.key)}>
        {shops.map((shop, i) => (
          <Menu.Item key={i}>{shop.name}</Menu.Item>
        ))}
      </NavMenu>
      <Content>
        <Title level={2}>{shop.name}</Title>
        <Table
          rowKey={(x) => x.name}
          dataSource={shop.inventory.map((x) => {
            return { name: x };
          })}
          columns={[{ title: "Item Name", dataIndex: "name", key: "name" }]}
        />
      </Content>
    </Root>
  );
};

export default HomePage;
