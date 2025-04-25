const mongoose = require('mongoose');
const Chat = require('./models/chat'); // Ensure this file exists and exports the model

main()
  .then(() => {
    console.log("Successfully connected to MongoDB");
    insertChats(); // Call after DB connection is established
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whattsapp');
}

async function insertChats() {
  const allchats = [
    {
      from: "user1",
      to: "user2",
      msg: "Hello",
      created_at: new Date(),
    },
    {
      from: "user2",
      to: "user1",
      msg: "Hi there!",
      created_at: new Date(),
    },
    {
      from: "user2",
      to: "user1",
      msg: "How are you?",
      created_at: new Date(),
    },
  ];

  try {
    const res = await Chat.insertMany(allchats);
    console.log("Chats inserted successfully:", res);
  } catch (err) {
    console.error("Error inserting chats:", err);
  }
}
