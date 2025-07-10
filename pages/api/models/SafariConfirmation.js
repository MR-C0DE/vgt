
import { db } from '../lib/db';

class SafariConfirmation {
 /* static getAll() {
    return db.query("SELECT * FROM participants ORDER BY id DESC").then(([res]) => res);
  }*/

  static async getAll() {
    // Récupérer tous les participants
    const [participants] = await db.query("SELECT * FROM participants ORDER BY id DESC");
    
    if (participants.length === 0) return [];
  
    // Extraire tous les IDs participants pour la requête suivante
    const participantIds = participants.map(p => p.id);
  
    // Récupérer tous les accompagnants liés à ces participants
    const [accompagnants] = await db.query(
      `SELECT * FROM accompagnants WHERE participant_id IN (${participantIds.map(() => '?').join(',')})`,
      participantIds
    );
  
    // Regrouper les accompagnants par participant_id
    const accompagnantsByParticipant = accompagnants.reduce((acc, accmp) => {
      if (!acc[accmp.participant_id]) acc[accmp.participant_id] = [];
      acc[accmp.participant_id].push(accmp);
      return acc;
    }, {});
  
    // Ajouter un tableau "accompagnants" à chaque participant
    const participantsWithAccompagnants = participants.map(p => ({
      ...p,
      accompagnants: accompagnantsByParticipant[p.id] || []
    }));
  
    return participantsWithAccompagnants;
  }
  

  static getById(id) {
    return db.query("SELECT * FROM participants WHERE id = ?", [id]).then(([res]) => res[0]);
  }

  static async insertParticipant(data) {
    const query = `
      INSERT INTO participants 
      (form_submit_id, first_name, last_name, age_category, contribution, medical_issues, medical_details, is_driver, accompagnant_is_driver, has_space, capacity, vehicle, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.form_submit_id,
      data.first_name,
      data.last_name,
      data.age_category,
      data.contribution,
      data.medical_issues,
      data.medical_details,
      data.is_driver === 'yes',
      data.accompagnant_is_driver === 'yes',
      data.has_space === 'yes',
      data.capacity,
      data.vehicle,
      data.phone,
    ];
    const [result] = await db.query(query, values);
    return result.insertId;
  }

  static async insertAccompagnants(participant_id, accompagnants) {
    if (!accompagnants || accompagnants.length === 0) return;
    const values = accompagnants.map((acc) => [
      participant_id,
      acc.firstName,
      acc.lastName,
      acc.ageCategory,
      acc.contribution,
      acc.allergies,
      acc.medicalDetails,
    ]);

    const query = `
      INSERT INTO accompagnants 
      (participant_id, first_name, last_name, age_category, contribution, allergies, medical_details)
      VALUES ?
    `;
    await db.query(query, [values]);
  }

  static async deleteById(id) {
    return db.query("DELETE FROM participants WHERE id = ?", [id]);
  }

  static async updateById(id, data) {
    const query = `
      UPDATE participants SET 
      first_name = ?, last_name = ?, age_category = ?, contribution = ?, medical_issues = ?, medical_details = ?, 
      is_driver = ?, accompagnant_is_driver = ?, has_space = ?, capacity = ?, vehicle = ?, phone = ?
      WHERE id = ?
    `;
    const values = [
      data.first_name,
      data.last_name,
      data.age_category,
      data.contribution,
      data.medical_issues,
      data.medical_details,
      data.is_driver === 'yes',
      data.accompagnant_is_driver === 'yes',
      data.has_space === 'yes',
      data.capacity,
      data.vehicle,
      data.phone,
      id,
    ];
    return db.query(query, values);
  }
}

export { SafariConfirmation };
