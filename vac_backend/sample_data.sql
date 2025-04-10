INSERT INTO vac_management_vaccinecategory (id, category_name, active, created_date, updated_date) VALUES
(1, 'COVID-19', TRUE, NOW(), NOW()),
(2, 'Influenza', TRUE, NOW(), NOW()),
(3, 'Hepatitis B', TRUE, NOW(), NOW()),
(4, 'MMR', TRUE, NOW(), NOW());

INSERT INTO vac_management_vaccine (id, category_id, vaccine_name, dose_quantity, instruction, unit_price, active, created_date, updated_date) VALUES
(1, 1, 'Pfizer', 2, 'Store in cold temperature', 19.99, TRUE, NOW(), NOW()),
(2, 2, 'Flu Shot', 1, 'Annual vaccination', 9.99, TRUE, NOW(), NOW()),
(3, 3, 'Engerix-B', 3, 'Administer intramuscularly', 29.99, TRUE, NOW(), NOW()),
(4, 4, 'MMR II', 1, 'Store in refrigerator', 39.99, TRUE, NOW(), NOW());

INSERT INTO vac_management_baseuser (id, username, is_active, password, first_name, last_name, date_joined, email, date_of_birth, is_superuser, is_staff, phone_number, address, gender) VALUES
(2, 'dainy_user', 1, 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'dainy', 'nguyen', current_date(), 'dain@gmail.com', '1985-05-15', 0, 0, '093093403', '123 Elm St', 'male'),
(3, 'john_doe', 1, 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'John', 'Doe', current_date(), 'john@example.com', '1990-01-01', 0, 0, '1234567890', '123 Elm St', 'male'),
(4, 'bob_citizen', 1, 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'Bob', 'Citizen', current_date(), 'bob@example.com', '1988-08-08', 0, 0, '3344556677', '654 Birch St', 'male'),
(5, 'trump_doctor', 1, 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'Donald', 'Trump', current_date(), 'trump@example.com', '1988-08-08', 1, 1, '099534594', '654 Birch St', 'male'),
(6, 'dainy_staff', 1, 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'Dainy', 'Nguyen', current_date(), 'dainy@example.com', '1988-08-08', 1, 1,'095485423', '654 Birch St', 'male'),
(7, 'dung_doctor', 1, 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'Truong',  'Dung', current_date(), 'dung@example.com', '1988-08-08', 1, 1, '099423423', '654 Birch St', 'male'),
(8, 'dung_staff', 1, 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'Hoang', 'Huy', current_date(), 'dainy@example.com', '1988-08-08', 1, 1, '095485423', '654 Birch St', 'male');

INSERT INTO vac_management_citizen (baseuser_ptr_id, health_note) VALUES
(2, 'No allergies'),
(3, 'Sigma boy'),
(4, 'Sui mao ga');

INSERT INTO vac_management_staff (baseuser_ptr_id, shift, hire_date) VALUES
(6, 'morning','2020-01-01'),
(8, 'afternoon','2019-06-01');

INSERT INTO vac_management_doctor (baseuser_ptr_id, specialty, years_of_experience, medical_license) VALUES
(5, 'Pediatrics', 15, 'LIC12345'),
(7, 'General Medicine', 25, 'LIC67890');

INSERT INTO vac_management_appointment (id, citizen_id, scheduled_date, staff_id, location, notes, active, created_date, updated_date) VALUES
(1, 2, '2023-12-01', 6, 'Main Clinic', 'First dose', TRUE, NOW(), NOW()),
(2, 3, '2023-12-05', 8, 'Downtown Clinic', 'Second dose', TRUE, NOW(), NOW()),
(3, 4, '2023-12-10', 6, 'Uptown Clinic', 'First dose', TRUE, NOW(), NOW());

INSERT INTO vac_management_appointmentvaccine (id, appointment_id, vaccine_id, doctor_id, dose_quantity_used, status, notes, cost, active, created_date, updated_date) VALUES
(1, 1, 1, 5, 1, 'scheduled', 'Follow-up in 3 weeks', 19.99, TRUE, NOW(), NOW()),
(2, 2, 3, 7, 1, 'scheduled', 'Check for side effects', 29.99, TRUE, NOW(), NOW()),
(3, 3, 4, 5, 1, 'scheduled', 'Follow-up in 4 weeks', 39.99, TRUE, NOW(), NOW());

INSERT INTO vac_management_campaign (id, campaign_name, start_date, end_date, description, target_population, status, active, created_date, updated_date) VALUES
(1, 'Winter Flu Campaign', '2023-11-01', '2023-12-31', 'Annual flu vaccination campaign', 1000, 'planned', TRUE, NOW(), NOW()),
(2, 'Spring Hepatitis Campaign', '2024-03-01', '2024-04-30', 'Hepatitis B vaccination campaign', 500, 'planned', TRUE, NOW(), NOW());

INSERT INTO vac_management_campaignvaccine (id, vaccine_id, campaign_id, dose_quantity_used, active, created_date, updated_date) VALUES
(1, 2, 1, 100, TRUE, NOW(), NOW()),
(2, 3, 2, 200, TRUE, NOW(), NOW()),
(3, 4, 2, 150, TRUE, NOW(), NOW());

INSERT INTO vac_management_campaigncitizen (id, active, created_date,updated_date, injection_date, campaign_id, citizen_id) VALUES
(1, 1, NOW(), NOW(), '2025-04-09', 1, 2),
(2, 1, NOW(), NOW(), '2025-04-15', 2, 3),
(3, 1, NOW(), NOW(), '2025-04-21', 1, 4);