const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();
app.use(cors());
app.use(express.json());

const stripe = Stripe("YOUR_STRIPE_SECRET_KEY_HERE");

app.post("/create-checkout-session", async (req, res) => {
  try {
    const items = req.body.items;

    const lineItems = items.map(item => ({
      price_data: {
        currency: "cad",
        product_data: {
          name: item.name
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: "http://localhost:5500/success.html",
      cancel_url: "http://localhost:5500/cancel.html"
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Unable to create checkout session." });
  }
});

app.listen(4242, () => {
  console.log("Server running on http://localhost:4242");
});
