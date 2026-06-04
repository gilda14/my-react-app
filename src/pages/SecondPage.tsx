import PageTemplate from "../PageTemplate";
import { useNavigate } from "react-router-dom";
import SearchItem from "../components/SearchItem";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  picture: string;
};

type ShoppingItem = {
  id: string;
  item: Product;
  quantity: number;
};

export default function Secondpage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Apple",
      price: 2.99,
      picture: "/apple.png",
    },
    {
      id: 2,
      name: "Milk",
      price: 4.5,
      picture: "/milk.png",
    },
    {
      id: 3,
      name: "Bread",
      price: 3.25,
      picture: "/bread.png",
    },
  ]);
  //new  shopping list
  // const [newName, setNewName] = useState("");
  // const [newPrice, setNewPrice] = useState("");
  // const [newPicture, setNewPicture] = useState("");
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const savedList = localStorage.getItem("shoppingList");
    return savedList ? JSON.parse(savedList) : [];
  });

  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  }, [shoppingList]);

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
    const existingItem = shoppingList.find(
      (item) => item.item.id === product.id,
    );

    if (existingItem) {
      setShoppingList(
        shoppingList.map((item) =>
          item.item.id === product.id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item,
        ),
      );
    } else {
      setShoppingList([
        ...shoppingList,
        {
          id: crypto.randomUUID(),
          item: product,
          quantity: 1,
        },
      ]);
    }
  }

  //delete item from shopping list
  // function handleDeleteItem(id: string) {
  //   setShoppingList(shoppingList.filter((item) => item.id !== id));
  // }

  function handleGoToShoppingList() {
    navigate("/shopping-Page", { state: { shoppingList } });
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
                <img
                  src={product.picture}
                  style={{
                    width: "35px",
                    height: "35px",
                    marginLeft: "20px",
                    marginRight: "20px",
                  }}
                />
                <h4>{product.name}</h4>

                <p
                  style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  ${product.price}
                </p>

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

        {/* <h4>New Shopping List </h4>
        
        <div>
          {shoppingList.length === 0 ? (
            <p>You dont have anything in your shopping list yet</p>
          ) : (
            shoppingList.map((item) => (
              <div className="item" key={item.id}>
                <h4>{item.item.name}</h4>
                <p>${item.item.price}</p>
                <button onClick={() => handleDeleteItem(item.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div> */}
        <button onClick={() => handleGoToShoppingList()}>
          Go to Shopping List Page
        </button>

        <br />
        <button onClick={handleOnClick}>Log out</button>
      </div>
    </PageTemplate>
  );
}
