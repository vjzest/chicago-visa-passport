const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const PassportContentSchema = new mongoose.Schema(
    {
        section: { type: String, required: true, unique: true, default: "en" },
        data: { type: mongoose.Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

const PassportContentModel = mongoose.model("PassportContent", PassportContentSchema);

async function inspect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const content = await PassportContentModel.findOne({ section: "en" });
        if (content) {
            console.log("Found Content Document ID:", content._id);
            console.log("Updated At:", content.updatedAt);
            if (content.data && content.data.usPassportPage && content.data.usPassportPage.image) {
                console.log("Current Image Src in DB:", content.data.usPassportPage.image.src);
            } else {
                console.log("Image path not found in data structure.");
                console.log("Keys in data:", Object.keys(content.data));
            }
        } else {
            console.log("No content found for section 'en'");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

inspect();
