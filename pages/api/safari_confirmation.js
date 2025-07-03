import { SafariConfirmation } from "./models/SafariConfirmation";

// ✅ Basic validation helper
const isValidPhone = (phone) => /^\+?[0-9\s\-()]{10,}$/.test(phone);

export default async function handler(req, res) {
    const { method } = req;

    if (method === "GET") {
        try {
            const data = await SafariConfirmation.getAll();
            return res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("GET error:", error);
            return res.status(500).json({ message: "Failed to fetch data" });
        }
    }

    if (method === "POST") {
        try {
            const {
                first_name,
                last_name,
                age_category,
                contribution,
                medical_issues,
                medical_details,
                is_driver,
                has_space,
                capacity,
                vehicle,
                phone,
            } = req.body;

            // ✅ Basic validation
            if (!first_name || typeof first_name !== "string")
                return res.status(400).json({ message: "Invalid first name" });

            if (!last_name || typeof last_name !== "string")
                return res.status(400).json({ message: "Invalid last name" });

            if (!["adult", "child", "toddler", "baby"].includes(age_category))
                return res.status(400).json({ message: "Invalid age category" });

            if (!["yes", "no", "private"].includes(medical_issues))
                return res.status(400).json({ message: "Invalid medical issue value" });

            if (!["yes", "no"].includes(is_driver))
                return res.status(400).json({ message: "Invalid is_driver value" });

            if (!["yes", "no"].includes(has_space))
                return res.status(400).json({ message: "Invalid has_space value" });

            if (!phone || !isValidPhone(phone))
                return res.status(400).json({ message: "Invalid phone number" });

            const result = await SafariConfirmation.insert({
                first_name,
                last_name,
                age_category,
                contribution,
                medical_issues,
                medical_details,
                is_driver,
                has_space,
                capacity: capacity ? Number(capacity) : 0,
                vehicle,
                phone,
            });

            return res
                .status(201)
                .json({ message: "Confirmation submitted", id: result.insertId });
        } catch (error) {
            console.error("POST error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    if (method === "PUT") {
        try {
            const {
                id,
                first_name,
                last_name,
                age_category,
                contribution,
                medical_issues,
                medical_details,
                is_driver,
                has_space,
                capacity,
                vehicle,
                phone,
            } = req.body;

            if (!id) return res.status(400).json({ message: "ID is required for update" });

            const result = await SafariConfirmation.updateById(id, {
                first_name,
                last_name,
                age_category,
                contribution,
                medical_issues,
                medical_details,
                is_driver,
                has_space,
                capacity: capacity ? Number(capacity) : 0,
                vehicle,
                phone,
            });

            return res.status(200).json({ message: "Confirmation updated", result });
        } catch (error) {
            console.error("PUT error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    if (method === "DELETE") {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({ message: "ID is required for deletion" });

            const result = await SafariConfirmation.deleteById(id);
            return res.status(200).json({ message: "Confirmation deleted", result });
        } catch (error) {
            console.error("DELETE error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
}
