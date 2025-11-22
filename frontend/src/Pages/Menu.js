import React, { useContext } from "react";
import { CartContext } from "../Context/CartContext";
import Burger from "../Assets/Burger.jpg";
import Pizza from "../Assets/Pizza.jpg";
import Pasta from "../Assets/Pasta.jpg";
import Caramel from "../Assets/Caramel.jpg";
import Milkshake from "../Assets/Milkshake.jpg";
import Lemonade from "../Assets/Lemonade.jpg";
import Cake from "../Assets/Cake.jpg";
import IceCream from "../Assets/Icecream.jpg";
import Cheesecake from "../Assets/Cheesecake.jpg";

function Menu() {
  const { addToCart } = useContext(CartContext);

  const dishes = [
    { id: 1, name: "CheesBurger", price: 6.99, image: Burger },
    { id: 2, name: "Pizza", price: 7.99, image: Pizza },
    { id: 3, name: "Pasta", price: 6.99, image: Pasta },
    { id: 4, name: "Caramel Frappe", price: 4.99, image: Caramel },
    { id: 5, name: "Chocolate Milkshake", price: 4.49, image: Milkshake },
    { id: 6, name: "Lemonade", price: 2.99, image: Lemonade },
    { id: 7, name: "Chocolate Cake", price: 3.99, image: Cake },
    { id: 8, name: "Ice Cream", price: 3.49, image: IceCream },
    { id: 9, name: "Cheesecake", price: 4.29, image: Cheesecake },
  ];

  return (
    <div className="container py-4">
      <div className="row g-4">
        {dishes.map((item) => (
          <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm text-center">
              <img
                src={item.image}
                className="card-img-top"
                style={{ height: "150px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5>{item.name}</h5>
                <p>${item.price.toFixed(2)}</p>
                <button className="btn btn-danger" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
