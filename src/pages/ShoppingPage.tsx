import PageTemplate from "../PageTemplate";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  picture: string;
};

type ShoppingItem = {
  id: string;
  item: Product;
};

export default function ShoppingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(
    location.state?.shoppingList || [],
  );

  function handleDeleteItem(id: string) {
    const updatedList = shoppingList.filter((item) => item.id !== id);

    setShoppingList(updatedList);

    localStorage.setItem("shoppingList", JSON.stringify(updatedList));
  }

  return (
    <PageTemplate>
      <div className="div">
        <h2>Shopping List Page</h2>

        {shoppingList.length === 0 ? (
          <p>No items in shopping list</p>
        ) : (
          shoppingList.map((item) => (
            <div className="item" key={item.id}>
              <h4>{item.item.name}</h4>

              <p>${item.item.price}</p>

              <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
            </div>
          ))
        )}

        <button onClick={() => navigate("/second-page")}>Back</button>
      </div>
    </PageTemplate>
  );
}
