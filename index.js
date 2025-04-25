const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override'); // ✅ added for PUT support
const Chat = require('./models/chat'); // Ensure this file exists

const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public'))); // it connects our views and public folder with maon folder
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method')); // ✅ use method override

// Set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());

// MongoDB connection
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whattsapp');
}

//index route 
app.get("/chats", async (req, res) => {
  let chats = await Chat.find();
  console.log(chats);
  res.render("index.ejs", { chats });
});  

//new route
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

//create route
app.post("/chats", async (req, res) => {
  const { from, to, msg } = req.body; // ✅ Extracting from the form data

  let newChat = new Chat({
    from,
    to,
    msg,
    created_at: new Date(),
  });

  try {
    await newChat.save(); // ✅ changed from .then() to await
    console.log("New chat created:", newChat);
    res.redirect("/chats"); // ✅ redirect only after saving
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).send("Failed to create chat.");
  }
});


main()
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch(err => console.log(err));

//EDIT route
app.get("/chats/:id/edit", async(req,res)=>{
  const { id } = req.params; // Extracting the ID from the URL
  try {
    const chat = await Chat.findById(id); // Find the chat by ID
    if (!chat) {
      return res.status(404).send("Chat not found");
    }
    res.render("edit.ejs", { chat }); // Pass the chat to

  } catch (err) {
    res.status(500).send("Error fetching chat");
  }
});

//update route
app.put("/chats/:id", async (req, res) => {
  const { id } = req.params;
  const { newMsg } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true, new: true });
    console.log("Chat updated:", updatedChat);
    res.redirect("/chats");
  } catch (err) {
    console.error("Error updating chat:", err);
    res.status(500).send("Failed to update chat.");
  }
});


// Routes
app.get('/', (req, res) => {
  res.send('root is working');
});

app.get("/chats/:id", async (req, res) => {
  const { id } = req.params;
  const chat = await Chat.findById(id);
  if (!chat) return res.status(404).send("Chat not found");
  res.send(chat); // You can create a `show.ejs` view later if needed
});


// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
