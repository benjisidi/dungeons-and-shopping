import { PageWrapper, ItemCard } from "../components";
import styled from "styled-components";

const ItemGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Shop = () => {
  return (
    <PageWrapper>
      <div className="main-area">
        <h1 className="bp3-heading">Shop Title</h1>
        <ItemGrid>
          <ItemCard
            title="Some Item"
            classification="Placeholder Item"
            cost="5gp"
            description="Creation subschool dwarf domain fear cone gaze light weapon metal domain monstrous humanoid type move action petrified ray strength water domain.Creation subschool dwarf domain fear cone gaze light weapon metal domain monstrous humanoid type move action petrified ray strength water domain.Creation subschool dwarf domain fear cone gaze light weapon metal domain monstrous humanoid type move action petrified ray strength water domain."
          />
          <ItemCard
            title="Some Item"
            classification="Placeholder Item"
            cost="5gp"
            description="Creation subschool dwarf domain fear cone gaze light weapon metal domain monstrous humanoid type move action petrified ray strength water domain."
          />
          <ItemCard
            title="Some Item"
            classification="Placeholder Item"
            cost="5gp"
            description="Creation subschool dwarf domain fear cone gaze light weapon metal domain monstrous humanoid type move action petrified ray strength water domain."
          />
          <ItemCard
            title="Some Item"
            classification="Placeholder Item"
            cost="5gp"
            description="Creation subschool dwarf domain fear cone gaze light weapon metal domain monstrous humanoid type move action petrified ray strength water domain."
          />
          <ItemCard
            title="Some Item"
            classification="Placeholder Item"
            cost="5gp"
            description="Creation subschool dwarf domain fear cone gaze light weapon metal domain monstrous humanoid type move action petrified ray strength water domain."
          />
          <ItemCard
            title="Some Item"
            classification="Placeholder Item"
            cost="5gp"
            description="Creation subschool dwarf domain fear cone gaze light weapon metal domain monstrous humanoid type move action petrified ray strength water domain."
          />
          <ItemCard
            title="Some Item"
            classification="Placeholder Item"
            cost="5gp"
            description="Creation subschool dwarf domain fear cone gaze light weapon metal domain monstrous humanoid type move action petrified ray strength water domain."
          />
          <ItemCard
            title="Some Item"
            classification="Placeholder Item"
            cost="5gp"
            description="Creation subschool dwarf domain fear cone gaze light weapon metal domain monstrous humanoid type move action petrified ray strength water domain."
          />
        </ItemGrid>
      </div>
    </PageWrapper>
  );
};

export default Shop;
