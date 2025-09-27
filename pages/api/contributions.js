import { connectToDatabase } from "./lib/mongodb";
import Contribution from "./models/Contribution";

export default async function handler(req, res) {
    await connectToDatabase();
    const { method } = req;
    const browserId = req.headers["x-browser-id"];

    if (!browserId) return res.status(400).json({ error: "Browser ID missing" });

    switch (method) {
        case "GET":
            try {
                const contributions = await Contribution.find().sort({ createdAt: -1 });
                return res.status(200).json(contributions);
            } catch (error) {
                return res.status(500).json({ error: "Failed to fetch contributions" });
            }

        case "POST":
            try {
                const { name, contribution } = req.body;
                if (!name || !contribution)
                    return res.status(400).json({ error: "Name and contribution required" });

                const newContribution = await Contribution.create({ name, contribution, browserId });
                return res.status(201).json(newContribution);
            } catch (error) {
                return res.status(500).json({ error: "Failed to create contribution" });
            }

        case "PUT":
            try {
                const { id, newName, newContribution: updatedContribution } = req.body;
                const existing = await Contribution.findById(id);
                if (!existing) return res.status(404).json({ error: "Contribution not found" });
                if (existing.browserId !== browserId)
                    return res.status(403).json({ error: "Not allowed" });

                existing.name = newName || existing.name;
                existing.contribution = updatedContribution || existing.contribution;
                await existing.save();

                return res.status(200).json(existing);
            } catch (error) {
                return res.status(500).json({ error: "Failed to update contribution" });
            }

        case "DELETE":
            try {
                const { id: deleteId } = req.query;
                const item = await Contribution.findById(deleteId);
                if (!item) return res.status(404).json({ error: "Contribution not found" });
                if (item.browserId !== browserId)
                    return res.status(403).json({ error: "Not allowed" });

                await Contribution.findByIdAndDelete(deleteId);
                return res.status(204).end();
            } catch (error) {
                return res.status(500).json({ error: "Failed to delete contribution" });
            }

        default:
            return res.status(405).end(); // Method Not Allowed
    }
}
