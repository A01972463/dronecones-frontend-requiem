import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Product, UserType,Order } from "../../types";
import { useStore } from "../../store";
import { getPriceString } from "../../services/helperFunctions";
import { Box, Grid, Card, Typography, useTheme } from "@mui/material";
import useGetHistory from "../../services/manager/useGetHistory";
import useGetInventory from "../../services/manager/useGetInventory";
import { all } from "axios";

const textStyle = {
  color: "white",
  fontFamily: "pixelfont",
};

function findMostCommonItem<T>(arr: T[]): T | null {
  if (arr.length === 0) {
    return null;
  }

  const frequencyMap: Record<string, number> = {};

  for (const item of arr) {
    const key = JSON.stringify(item); // Convert the item to a string for simplicity
    frequencyMap[key] = (frequencyMap[key] || 0) + 1;
  }

  let mostCommonItem: T | null = null;
  let maxFrequency = 0;

  for (const key in frequencyMap) {
    if (frequencyMap[key] > maxFrequency) {
      maxFrequency = frequencyMap[key];
      mostCommonItem = JSON.parse(key); // Convert the key back to the original type
    }
  }

  return mostCommonItem;
}

export default function ManagerQuickviewPage() {
  const user = useStore((state) => state.user);
  const orders = useStore((state) => state.orders);
  const products = useStore((state) => state.products)
  const theme = useTheme();
  let earnings = 0;
  let notifyQuantityValue = 30;
  let lowStockItems: Product[] = [];
  let currentProducts: Product[] = [];
  let allOrders: Order[] = [];
  let mostPopularTopping:string | null = "None";
  let mostPopularFlavor:string | null = "None";
  let mostPopularCone:string | null = "None";
  let soldCones = 0;

  {/*Loads dummy data*/}
  const { loadHistory } = useStore();
  if (orders.length === 0) {
    loadHistory(useGetHistory());
  }
  const { loadProducts } = useStore();
  if(loadProducts.length === 0){
    console.log("Dummy products loaded");
    loadProducts(useGetInventory());
  }




  let totalToppings = [];
  let totalFlavors = [];
  let totalCones = [];

  //iterates through orders cones items
  orders.forEach((order) => (allOrders.push(order)));
  for(let i = 0; i < allOrders.length; i++){
    earnings += allOrders[i].totalPrice;
    for(let j = 0; j < allOrders[i].cones.length;j++){
      let currentCone = allOrders[i].cones;
      for(let k = 0; k < currentCone[0].components.length;k++){
      
        let currentName:string = currentCone[0].components[k].name;
        if(currentCone[0].components[k].type=="Topping"){
          totalToppings.push(currentName);
          console.log(currentName);
        } else if(currentCone[0].components[k].type=="Cone"){
          totalCones.push(currentName);
        } else totalFlavors.push(currentName);
      }

    }
  }
  mostPopularTopping = findMostCommonItem(totalToppings);
  mostPopularCone = findMostCommonItem(totalCones);
  mostPopularFlavor = findMostCommonItem(totalFlavors);

  //iterates though inventory
  products.forEach((product) => (currentProducts.push(product)));
  for (let i = 0; i < currentProducts.length; i++) {

    if (typeof currentProducts[i].stock !== "undefined") {
      if(currentProducts[i].stock){
        currentProducts[i].stock = currentProducts[i].stock;
        let stock:number | undefined = currentProducts[i].stock;
        if(stock){
          if(stock <= notifyQuantityValue){
            lowStockItems.push(currentProducts[i]);
          }
        }
      } else {

        lowStockItems.push(currentProducts[i]);
      }
    }
  }
  let stockTitle = "Low Stock Items!"
  if(lowStockItems.length === 0){
    stockTitle = "No items need restocking!"
  }
  const renderedLowStockItems = lowStockItems.map((item) => {
    let urgencyColor = "white";
    if(item.stock){
      if(item.stock <= 5){
        urgencyColor = "red";
      } else if(item.stock <= 20){
        urgencyColor = "yellow";
      }
    } else urgencyColor = "red";
    return (
      <p style={{color:urgencyColor, margin:"0px"}}
        key={item.id}
      >
        {item.name} - {item.stock}
      </p>
    );
  });


  

  return (
    <>
      {user.userType === UserType.MANAGER && (
        <>
            {/*Manager Quickview Page, displays and overview of manager information
            and status.*/
            }
<Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            justifyContent: "center",
            gap: 2,
            padding: 3,
            backgroundColor: `${theme.palette.background.paper}`,
          }}
        >
              <Typography
                sx={textStyle}
                variant="h4"
                component="h2"
                gutterBottom
              >
                Welcome back, {user.username}!
              </Typography>
              <Typography
                sx={textStyle}
                variant="h4"
                component="h2"
                gutterBottom
              >
                Your location has made {getPriceString(earnings)}!
              </Typography>

              <Typography
                sx={textStyle}
                variant="h4"
                component="h2"
                gutterBottom
              >
                {products.length} items available!
              </Typography>
              <div className="centerFormat"><h3 style={{  
                    color: "white",
                    fontFamily: "pixelfont"}}>Here are the most popular options:</h3></div>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card sx={textStyle}><div 
                    className="centerFormat">Flavor<p>{mostPopularFlavor}</p></div></Card>
                </Grid>
                <Grid item xs={4}>
                <Card sx={textStyle}><div className="centerFormat">Topping<p>{mostPopularTopping}</p></div></Card>
                </Grid>
                <Grid item xs={4}>
                <Card sx={textStyle}><div className="centerFormat">Cone<p>{mostPopularCone}</p></div></Card>
                </Grid>
                <Grid item xs={12}>
                <Card sx={textStyle}><div className="centerFormat">{stockTitle}{renderedLowStockItems}</div></Card>
                </Grid>
              </Grid>

            

        </Box>



            {/*Nav buttons*/} 
          <Button
            variant="contained"
            component={Link}
            to="/app/manage-inventory"
          >
            Manage Inventory
          </Button>
          <Button variant="contained" component={Link} to="/app/manage-users">
            Manage Users
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/app/manager-history"
          >
            Manager History
          </Button>
        </>
      )}
    </>
  );
}
