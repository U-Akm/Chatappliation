import Conversation from "../Models/conversationModels.js";
import User from "../Models/userModels.js";

export const getUserBySearch = async (req, res) => {
    try {
        const search = req.query.search || ''; // Default to empty string if no search term is provided
        const currentUserID = req.user?._id;  // Make sure req.user is defined and contains _id

        // Log the search term and current user ID for debugging
        console.log("Search term:", search);
        console.log("Current User ID:", currentUserID);

        if (!currentUserID) {
            return res.status(400).send({
                success: false,
                message: "User ID is missing. Authentication failed."
            });
        }

        const users = await User.find({
            $and: [
                {
                    $or: [
                        { username: { $regex: '.*' + search + '.*', $options: 'i' } },
                        { fullname: { $regex: '.*' + search + '.*', $options: 'i' } }
                    ]
                },
                { _id: { $ne: currentUserID } }
            ]
        }).select("username fullname email profilepic gender createdAt updatedAt");  // Explicitly include all desired fields
        // Exclude password and email

        // Check if users are found
        if (!users || users.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No users found matching the search criteria."
            });
        }

        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getCorrentChatters = async (req, res) => {
    try {
        const currentUserID = req.user?._id; // Ensure that currentUserID is present in req.user

        // Log the current user ID for debugging
        console.log("Current User ID:", currentUserID);

        if (!currentUserID) {
            return res.status(400).send({
                success: false,
                message: "User ID is missing. Authentication failed."
            });
        }

        const currentChatters = await Conversation.find({
            participants: currentUserID
        }).sort({ updatedAt: -1 });

        // If no chatters are found, return an empty array
        if (!currentChatters || currentChatters.length === 0) return res.status(200).send([]);

        const participantIDs = currentChatters.reduce((ids, conversation) => {
            const otherParticipants = conversation.participants.filter(id => id !== currentUserID);
            return [...ids, ...otherParticipants];
        }, []);

        const otherParticipantsIDs = participantIDs.filter(id => id.toString() !== currentUserID.toString());

        const users = await User.find({ _id: { $in: otherParticipantsIDs } }).select("-password -email");

        // Map the user data to ensure we match the correct users
        const usersMapped = otherParticipantsIDs.map(id => users.find(user => user._id.toString() === id.toString())).filter(Boolean);

        res.status(200).send(usersMapped);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
};
