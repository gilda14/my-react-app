import PageTemplate from "../PageTemplate";
import { useNavigate } from "react-router-dom";
import SearchItem from "../components/SearchItem";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  picture: string;
};

export default function Secondpage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Apple",
      price: 2.99,
      picture: "",
    },
    {
      id: 2,
      name: "Milk",
      price: 4.5,
      picture: "",
    },
    {
      id: 3,
      name: "Bread",
      price: 3.25,
      picture: "",
    },
  ]);
  //new  shopping list
  // const [newName, setNewName] = useState("");
  // const [newPrice, setNewPrice] = useState("");
  // const [newPicture, setNewPicture] = useState("");
  const [shoppingList, setShoppingList] = useState<Product[]>([]);

  function handleOnClick() {
    navigate("/first-page");
  }

  // function handleAddProduct() {
  //   if (
  //     newName.trim() === "" ||
  //     newPrice.trim() === "" ||
  //     newPicture.trim() === ""
  //   )
  //     return;

  //   const newProduct: Product = {
  //     id: products.length ? products[products.length - 1].id + 1 : 1,
  //     name: newName,
  //     picture: newPicture,
  //     price: Number(newPrice),
  //   };

  //   setProducts([...products, newProduct]);

  //   setNewName("");
  //   setNewPrice("");
  //   setNewPicture("");
  // }

  //Add Item to the shopping list
  function handAddToList(product: Product) {
    setShoppingList([...shoppingList, product]);
  }

  //delete item from shopping list
  function handleDeleteItem(id: number) {
    setShoppingList(shoppingList.filter((product) => product.id !== id));
  }
  return (
    <PageTemplate>
      <div className="div">
        <h3>All Products</h3>

        <SearchItem setSearch={setSearch} />

        <div>
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(search.toLowerCase()),
            )
            .map((product) => (
              <div className="item" key={product.id}>
                <h4>{product.name}</h4>

                <p>${product.price}</p>

                <button onClick={() => handAddToList(product)}>
                  Add to the shopping list
                </button>
              </div>
            ))}
        </div>

        {/* <input
          type="text"
          placeholder="Product name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />

        <input
          type="text"
          placeholder="Picture URL"
          value={newPicture}
          onChange={(e) => setNewPicture(e.target.value)}
        />

        <button onClick={handleAddProduct}>Add Product</button> */}

        <h4>New Shopping List </h4>
        <div>
          {shoppingList.length === 0 ? (
            <p>You dont have anything in your shopping list yet</p>
          ) : (
            shoppingList.map((product) => (
              <div className="item" key={product.id}>
                <h4>{product.name}</h4>
                <p>${product.price}</p>
                <button onClick={() => handleDeleteItem(product.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <button onClick={handleOnClick}>Log out</button>
      </div>
    </PageTemplate>
  );
}
