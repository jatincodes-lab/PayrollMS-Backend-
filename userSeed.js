import User from "./models/User.js";
import bcrypt from "bcrypt";
import connectDB from "./Database/db.js";

const userRegister = async () => {
    await connectDB();
    try {
        const hashedPassword = await bcrypt.hash("123456", 10);
        const newUser = new User({
            name: "Admin User",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin",
            profileImage: "https://example.com/profile.jpg"
        });

        await newUser.save();
        console.log("User registered successfully:", newUser);
    } catch (err) {
        console.error("Error in user registration:", err);
    }
}

userRegister();