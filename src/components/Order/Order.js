import React from "react";

import classes from "./Order.module.css";

const order = (props) => {
  const ingredients = [];

  for (let name in props.ingredients) {
    ingredients.push({
      name: name,
      amount: props.ingredients[name],
    });
  }

  const ingredientsOutput = ingredients.map((ig) => (
    <span
      key={ig.name}
      style={{
        textTransform: "capitalize",
        display: "inline-block",
        margin: "0 8px",
        padding: "6px",
        border: "1px solid #ccc",
      }}
    >
      {ig.name} {ig.amount}
    </span>
  ));

  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredientsOutput}</p>
      <p>
        Price: <strong>USD {Number.parseFloat(props.price).toFixed(2)}</strong>
      </p>
    </div>
  );
};

export default order;
