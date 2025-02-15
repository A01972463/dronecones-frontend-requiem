import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import useGetMenu from "../../services/customer/useGetMenu";
import { Product, ProductType } from "../../types";
import Card from "@mui/material/Card";
import { useStore } from "../../store";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { IconButton } from "@mui/material";

const optionButtonStyle = {
  backgroundColor: "DarkViolet",
  fontFamily: "pixelfont",
  textShadow: "0 0 10px rgba(0, 153, 255, 0.7)",
  color: "#ffff",
};

export default function MenuPage() {
  const toppingsList = useStore((state) =>
    state.products.filter((product) => product.type === ProductType.TOPPING)
  );
  const flavorList = useStore((state) =>
    state.products.filter((product) => product.type === ProductType.ICECREAM)
  );
  const conesList = useStore((state) =>
    state.products.filter((product) => product.type === ProductType.CONE)
  );

  const products = useStore((state) => state.products);
  const { loadProducts } = useStore();

  if (products.length === 0) {
    loadProducts(useGetMenu());
  }

  const [selectedToppings, setselectedToppings] = useState(Array<Product>);
  const [selectedFlavors, setselectedFlavors] = useState(Array<Product>);
  const [selectedCone, setselectedCone] = useState(Array<Product>);

  {
    /*Populate topping options*/
  }
  const renderedToppingsList = toppingsList.map((item) => {
    return (
      <Button
        sx={optionButtonStyle}
        key={item.id}
        onClick={() => {
          if (selectedToppings.length < 3) {
            setselectedToppings([...selectedToppings, item]);
          }
        }}
      >
        {item.name}
      </Button>
    );
  });

  {
    /*Populate flavor options*/
  }
  const renderedFlavorList = flavorList.map((item) => {
    return (
      <Button
        sx={optionButtonStyle}
        key={item.id}
        onClick={() => {
          if (selectedFlavors.length < 3) {
            setselectedFlavors([...selectedFlavors, item]);
          }
        }}
      >
        {item.name}
      </Button>
    );
  });

  {
    /*Populate cone options*/
  }
  const renderedConesList = conesList.map((item) => {
    return (
      <Button
        sx={optionButtonStyle}
        key={item.id}
        onClick={() => {
          setselectedCone([item]);
          console.log(item);
        }}
      >
        {item.name}
      </Button>
    );
  });

  function showSelectedOptions(list: Product[]) {
    let display = "";
    for (let i = 0; i < list.length; i++) {
      if (i == 0) {
        display = list[i].name;
      } else {
        display = display + "\n" + list[i].name;
      }
    }

    if (list.length === 0) display = "None";
    return (
      <div className="pixel-font" style={{ whiteSpace: "pre-line" }}>
        {display}
      </div>
    );
  }

  const dynamicSelectedToppings = showSelectedOptions(selectedToppings);
  const dynamicSelectedFlavors = showSelectedOptions(selectedFlavors);

  const [error, setError] = useState<Error | null>(null);

  // const fetchMenu = async () => {
  //   const menuInfo = await useGetMenu();
  //   console.log("MENU INFO");
  //   console.log(menuInfo);
  //   if (menuInfo instanceof Error) {
  //     setError(menuInfo);
  //   } else {
  //     setMenu(menuInfo);
  //   }
  // };

  // useEffect(() => {
  //   fetchMenu();
  // }, []);

  return error ? (
    <>
      <h1>ERROR</h1>
    </>
  ) : (
    <>
      <div style={{ display: "flex" }}>
        {/*LHS Menu Side*/}
        <div>
          {/*TOPPINGS*/}
          <h1 className="header-font">TOPPINGS</h1>
          {renderedToppingsList}

          {/*FLAVORS*/}
          <h1 className="header-font">FLAVOR</h1>
          {renderedFlavorList}

          {/*CONES*/}
          <h1 className="header-font">CONE</h1>
          {renderedConesList}

          {/*CART*/}
          <h1 className="header-font">CART</h1>

          <Button
            variant="contained"
            component={Link}
            to="/app/cart"
            sx={optionButtonStyle}
          >
            View Cart
          </Button>
        </div>

        {/*RHS View Order*/}
        <div>
          <Card
            style={{
              marginLeft: "100px",
              paddingLeft: "100px",
              paddingRight: "100px",
            }}
          >
            <div className="centerFormat">
              {/*Display selected toppings*/}
              <div style={{ display: "flex" }}>
                <h1 style={{ margin: "10px" }} className="header-font">
                  My Toppings
                </h1>
                <IconButton
                  sx={optionButtonStyle}
                  style={{ height: "40px", margin: "10px" }}
                  onClick={() => {
                    setselectedToppings([]);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              <div>{dynamicSelectedToppings}</div>

              {/*Display selected scoops*/}
              <div style={{ display: "flex" }}>
                <h1 style={{ margin: "5px" }} className="header-font">
                  My Scoops
                </h1>
                <IconButton
                  sx={optionButtonStyle}
                  style={{ height: "40px", margin: "5px" }}
                  onClick={() => {
                    setselectedFlavors([]);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              <div style={{ margin: "0px", border: "0px", padding: "0px" }}>
                {dynamicSelectedFlavors}
              </div>

              <h1 style={{ margin: "10px" }} className="header-font">
                Selected Cone
              </h1>
              <p className="pixel-font">{selectedCone[0]?.name}</p>

              {/*This button will post item to cart database and reset everything locally that has been pressed*/}
              <Button
                variant="contained"
                sx={optionButtonStyle}
                onClick={() => {
                  if (
                    selectedFlavors.length !== 0 &&
                    selectedCone.length !== 0
                  ) {
                    {
                      /*-----SEND DATA TO CART HERE AND CLEAR OPTIONS--------*/
                    }

                    setselectedToppings([]);
                    setselectedFlavors([]);
                    setselectedCone([]);
                  } else {
                    console.log("Invalid Cone");
                  }
                }}
              >
                Add to Cart
              </Button>
              <br></br>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
