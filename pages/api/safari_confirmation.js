
import { SafariConfirmation } from "./models/SafariConfirmation";

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
        form_submit_id,
        first_name,
        last_name,
        age_category,
        contribution,
        medical_issues,
        medical_details,
        is_driver,
        accompagnant_is_driver,
        has_space,
        capacity,
        vehicle,
        phone,
        accompagnants = [],
      } = req.body;

      // VALIDATION
      if (!form_submit_id) return res.status(400).json({ message: "Missing form ID" });
      if (!first_name || !last_name || !age_category) return res.status(400).json({ message: "Missing required fields" });
      if (!["adult", "child", "toddler", "baby"].includes(age_category)) return res.status(400).json({ message: "Invalid age category" });
      if (!["yes", "no", "private"].includes(medical_issues)) return res.status(400).json({ message: "Invalid medical_issues" });
      if (!["yes", "no"].includes(is_driver)) return res.status(400).json({ message: "Invalid is_driver" });
      if (has_space && !["yes", "no"].includes(has_space)) return res.status(400).json({ message: "Invalid has_space" });
      if (phone && !isValidPhone(phone)) return res.status(400).json({ message: "Invalid phone number" });

      const participantId = await SafariConfirmation.insertParticipant({
        form_submit_id,
        first_name,
        last_name,
        age_category,
        contribution,
        medical_issues,
        medical_details,
        is_driver,
        accompagnant_is_driver,
        has_space,
        capacity: capacity ? Number(capacity) : 0,
        vehicle,
        phone,
      });

      await SafariConfirmation.insertAccompagnants(participantId, accompagnants);

      return res.status(201).json({ message: "Confirmation enregistrée", id: participantId });
    } catch (error) {
      console.error("POST error:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  if (method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "ID manquant" });
    try {
      await SafariConfirmation.deleteById(id);
      return res.status(200).json({ message: "Suppression réussie" });
    } catch (error) {
      console.error("DELETE error:", error);
      return res.status(500).json({ message: "Erreur suppression" });
    }
  }

  if (method === "PUT") {
    const {
      id,
      first_name,
      last_name,
      age_category,
      contribution,
      medical_issues,
      medical_details,
      is_driver,
      accompagnant_is_driver,
      has_space,
      capacity,
      vehicle,
      phone,
    } = req.body;
    if (!id) return res.status(400).json({ message: "ID manquant" });

    try {
      await SafariConfirmation.updateById(id, {
        first_name,
        last_name,
        age_category,
        contribution,
        medical_issues,
        medical_details,
        is_driver,
        accompagnant_is_driver,
        has_space,
        capacity,
        vehicle,
        phone,
      });
      return res.status(200).json({ message: "Modification enregistrée" });
    } catch (error) {
      console.error("PUT error:", error);
      return res.status(500).json({ message: "Erreur modification" });
    }
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
}
