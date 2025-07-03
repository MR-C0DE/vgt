import { db } from '../lib/db';

class SafariConfirmation {
    static getAll() {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM safari_confirmations ORDER BY id DESC")
                .then(([results]) => resolve(results))
                .catch((error) => reject(error));
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM safari_confirmations WHERE id = ?", [id])
                .then(([results]) => {
                    resolve(results.length > 0 ? results[0] : null);
                })
                .catch((error) => reject(error));
        });
    }

    static insert({
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
    }) {
        return new Promise((resolve, reject) => {
            const query = `
        INSERT INTO safari_confirmations 
        (first_name, last_name, age_category, contribution, medical_issues, medical_details, is_driver, has_space, capacity, vehicle, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
            const values = [
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
            ];

            db.query(query, values)
                .then(([results]) => resolve(results))
                .catch((error) => reject(error));
        });
    }

    static deleteById(id) {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM safari_confirmations WHERE id = ?", [id])
                .then(([results]) => resolve(results))
                .catch((error) => reject(error));
        });
    }

    static updateById(id, updatedData) {
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
        } = updatedData;

        return new Promise((resolve, reject) => {
            const query = `
        UPDATE safari_confirmations
        SET first_name = ?, last_name = ?, age_category = ?, contribution = ?, 
            medical_issues = ?, medical_details = ?, is_driver = ?, has_space = ?, 
            capacity = ?, vehicle = ?, phone = ?
        WHERE id = ?
      `;
            const values = [
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
                id,
            ];

            db.query(query, values)
                .then(([results]) => resolve(results))
                .catch((error) => reject(error));
        });
    }
}

export { SafariConfirmation };
