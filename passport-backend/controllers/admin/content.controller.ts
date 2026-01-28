import { Request, Response } from "express";
import { PassportContentModel } from "../../models/content.model";
import SocketService from "../../utils/socket";

// GET /api/v1/content
export const getContent = async (req: Request, res: Response) => {
    try {
        const content = await PassportContentModel.findOne({ section: "en" });
        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }
        res.status(200).json(content.data);
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// PUT /api/v1/admin/content
export const updateContent = async (req: Request, res: Response) => {
    try {
        const { data } = req.body;
        console.log("Received updateContent request:", {
            hasData: !!data,
            imageSrc: data?.usPassportPage?.image?.src
        });

        const content = await PassportContentModel.findOneAndUpdate(
            { section: "en" },
            { data },
            { new: true, upsert: true }
        );
        console.log("Updated content in DB:", {
            id: content._id,
            imageSrc: content.data?.usPassportPage?.image?.src
        });
        SocketService.emit("homepage-updated", content);
        res.status(200).json(content);
    } catch (error) {
        console.error("Error updating content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Internal helper or dev endpoint to seed initial data
export const seedContent = async (req: Request, res: Response) => {
    try {
        const { data } = req.body;
        // Check if exists
        const exists = await PassportContentModel.findOne({ section: "en" });
        if (exists) {
            return res.status(400).json({ message: "Content already exists. Use PUT to update." });
        }

        const newContent = new PassportContentModel({
            section: "en",
            data
        });
        await newContent.save();
        res.status(201).json(newContent);
    } catch (error) {
        console.error("Error seeding content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
