import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";
import { getReciverSocketId, io } from "../Socket/socket.js";
import upload from "../middleware/uploadFile.js"; // Importing Multer middleware from separate file

// Send Message with File Handling
export const sendMessage = async (req, res) => {
  try {
    // Handle file upload using Multer middleware
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const { messages } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id; // Correctly accessing the user ID

      // Find or create the conversation
      let chats = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!chats) {
        chats = await Conversation.create({
          participants: [senderId, receiverId],
        });
      }

      // File path if a file was uploaded
      const filePath = req.file ? `/uploads/${req.file.filename}` : null;

      // Create the new message
      const newMessage = new Message({
        senderId,
        receiverId,
        message: messages || null, // Allow null if only a file is sent
        conversationId: chats._id,
        file: filePath, // Save file path
      });

      // Push the message ID into the conversation's messages array
      if (newMessage) {
        chats.messages.push(newMessage._id);
      }

      // Save both the conversation and the message
      await Promise.all([chats.save(), newMessage.save()]);

      // Emit the new message to the receiver via Socket.IO
      const receiverSocketId = getReciverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      res.status(201).send(newMessage);
    });
  } catch (error) {
    console.error(`Error in sendMessage: ${error.message}`);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;  // Assuming you are using authentication and `req.user` is set

        // Retrieve conversation by sender and receiver
        const chats = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!chats) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        const messages = chats.messages;  // Get the messages from the conversation
        res.status(200).json(messages);  // Send back the messages
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};