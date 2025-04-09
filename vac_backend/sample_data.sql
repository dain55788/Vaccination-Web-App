-- Sample data for vaccination_management database

-- Set foreign key checks off (to allow deleting data in any order)
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data
DELETE FROM vac_management_campaignvaccine;
DELETE FROM vac_management_campaigncitizen;
DELETE FROM vac_management_appointmentvaccine;
DELETE FROM vac_management_appointment;
DELETE FROM vac_management_campaign;
DELETE FROM vac_management_vaccine;
DELETE FROM vac_management_vaccinecategory;
DELETE FROM vac_management_doctor;
DELETE FROM vac_management_staff;
DELETE FROM vac_management_citizen;
DELETE FROM auth_user;

-- Reset auto-increment counters
ALTER TABLE vac_management_vaccinecategory AUTO_INCREMENT = 1;
ALTER TABLE vac_management_vaccine AUTO_INCREMENT = 1;
ALTER TABLE vac_management_campaign AUTO_INCREMENT = 1;
ALTER TABLE vac_management_appointment AUTO_INCREMENT = 1;
ALTER TABLE vac_management_appointmentvaccine AUTO_INCREMENT = 1;
ALTER TABLE vac_management_campaignvaccine AUTO_INCREMENT = 1;
ALTER TABLE vac_management_campaigncitizen AUTO_INCREMENT = 1;
ALTER TABLE auth_user AUTO_INCREMENT = 1;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Vaccine Categories
INSERT INTO vac_management_vaccinecategory (category_name, active, created_date, updated_date) 
VALUES 
('COVID-19', 1, NOW(), NOW()),
('Influenza', 1, NOW(), NOW()),
('Hepatitis', 1, NOW(), NOW()),
('Measles', 1, NOW(), NOW()),
('Polio', 1, NOW(), NOW());

-- Insert Vaccines
INSERT INTO vac_management_vaccine (category_id, vaccine_name, dose_quantity, instruction, unit_price, image, active, created_date, updated_date) 
VALUES 
(1, 'Pfizer-BioNTech', 2, 'Administer intramuscularly in the deltoid. Second dose after 21 days.', 20.00, NULL, 1, NOW(), NOW()),
(1, 'Moderna', 2, 'Administer intramuscularly in the deltoid. Second dose after 28 days.', 25.00, NULL, 1, NOW(), NOW()),
(2, 'Fluzone', 1, 'Administer intramuscularly in the deltoid. Annual vaccination recommended.', 15.00, NULL, 1, NOW(), NOW()),
(3, 'Hepatitis A', 2, 'Administer intramuscularly. Second dose after 6-12 months.', 30.00, NULL, 1, NOW(), NOW()),
(4, 'MMR (Measles, Mumps, Rubella)', 2, 'Administer subcutaneously. Second dose at 4-6 years of age.', 22.00, NULL, 1, NOW(), NOW());

-- Insert Users and Citizens
INSERT INTO auth_user (username, password, email, first_name, last_name, is_staff, is_active, is_superuser, date_joined, last_login) 
VALUES 
('john_doe', 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'john.doe@example.com', 'John', 'Doe', 0, 1, 0, NOW(), NOW()),
('jane_smith', 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'jane.smith@example.com', 'Jane', 'Smith', 0, 1, 0, NOW(), NOW()),
('robert_johnson', 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'robert.johnson@example.com', 'Robert', 'Johnson', 0, 1, 0, NOW(), NOW());

INSERT INTO vac_management_citizen (baseuser_ptr_id, date_of_birth, avatar, phone_number, address, gender, health_note) 
VALUES 
(1, '1985-05-15', NULL, '555-123-4567', '123 Main St, Anytown, USA', 'male', 'No known allergies'),
(2, '1990-08-22', NULL, '555-987-6543', '456 Oak Ave, Somewhere, USA', 'female', 'Penicillin allergy'),
(3, '1978-03-10', NULL, '555-456-7890', '789 Pine Rd, Elsewhere, USA', 'male', 'Asthma');

-- Insert Staff
INSERT INTO auth_user (username, password, email, first_name, last_name, is_staff, is_active, is_superuser, date_joined, last_login) 
VALUES 
('staff_alex', 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'alex.staff@example.com', 'Alex', 'Johnson', 1, 1, 0, NOW(), NOW()),
('staff_sarah', 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'sarah.staff@example.com', 'Sarah', 'Williams', 1, 1, 0, NOW(), NOW());

INSERT INTO vac_management_staff (baseuser_ptr_id, date_of_birth, avatar, phone_number, address, gender, shift, hire_date) 
VALUES 
(4, '1988-06-12', NULL, '555-111-2222', '101 Staff St, Anytown, USA', 'male', 'morning', '2019-03-15'),
(5, '1992-09-05', NULL, '555-333-4444', '202 Staff Ave, Somewhere, USA', 'female', 'afternoon', '2020-05-10');

-- Insert Doctors
INSERT INTO auth_user (username, password, email, first_name, last_name, is_staff, is_active, is_superuser, date_joined, last_login) 
VALUES 
('dr_smith', 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'dr.smith@example.com', 'Michael', 'Smith', 1, 1, 0, NOW(), NOW()),
('dr_johnson', 'pbkdf2_sha256$600000$pMW8BqwipN4XPLLDKo82Km$dBCMHwXSYm9fvKXHEy/xDHBVTI8aDfS+pklWoJ98g9I=', 'dr.johnson@example.com', 'Emily', 'Johnson', 1, 1, 0, NOW(), NOW());

INSERT INTO vac_management_doctor (baseuser_ptr_id, date_of_birth, avatar, phone_number, address, gender, specialty, years_of_experience, medical_license) 
VALUES 
(6, '1975-04-20', NULL, '555-777-8888', '303 Doctor Blvd, Anytown, USA', 'male', 'Immunology', 15, 'MED12345'),
(7, '1983-11-08', NULL, '555-999-0000', '404 Doctor Ln, Somewhere, USA', 'female', 'Pediatrics', 10, 'MED67890');

-- Insert Campaigns
INSERT INTO vac_management_campaign (campaign_name, start_date, end_date, description, image, target_population, status, active, created_date, updated_date) 
VALUES 
('COVID-19 Mass Vaccination', '2023-01-15', '2023-03-15', 'A community-wide initiative to vaccinate against COVID-19.', NULL, 10000, 'completed', 1, NOW(), NOW()),
('Annual Flu Prevention', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'Annual campaign to administer flu vaccines before the winter season.', NULL, 5000, 'ongoing', 1, NOW(), NOW()),
('School Vaccination Drive', DATE_ADD(CURDATE(), INTERVAL 30 DAY), DATE_ADD(CURDATE(), INTERVAL 90 DAY), 'Vaccination program for school-aged children.', NULL, 3000, 'planned', 1, NOW(), NOW());

-- Insert Appointments
INSERT INTO vac_management_appointment (citizen_id, scheduled_date, staff_id, location, notes, active, created_date, updated_date) 
VALUES 
(1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 4, 'Main Clinic, Room 101', 'First appointment', 1, NOW(), NOW()),
(2, DATE_ADD(CURDATE(), INTERVAL 7 DAY), 5, 'Community Health Center', 'Follow-up appointment', 1, NOW(), NOW()),
(3, DATE_ADD(CURDATE(), INTERVAL 10 DAY), 4, 'Main Clinic, Room 105', 'Initial consultation', 1, NOW(), NOW());

-- Insert Appointment Vaccines
INSERT INTO vac_management_appointmentvaccine (appointment_id, vaccine_id, doctor_id, dose_quantity_used, status, notes, cost, active, created_date, updated_date) 
VALUES 
(1, 1, 6, 1, 'scheduled', 'First dose', 20.00, 1, NOW(), NOW()),
(2, 3, 7, 1, 'completed', 'Annual flu shot', 15.00, 1, NOW(), NOW()),
(3, 4, 6, 1, 'scheduled', 'First dose of series', 30.00, 1, NOW(), NOW());

-- Insert Campaign Citizens
INSERT INTO vac_management_campaigncitizen (campaign_id, citizen_id, injection_date, active, created_date, updated_date) 
VALUES 
(1, 1, '2023-02-15', 1, NOW(), NOW()),
(1, 2, '2023-02-20', 1, NOW(), NOW()),
(2, 3, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 1, NOW(), NOW());

-- Insert Campaign Vaccines
INSERT INTO vac_management_campaignvaccine (campaign_id, vaccine_id, dose_quantity_used, active, created_date, updated_date) 
VALUES 
(1, 1, 500, 1, NOW(), NOW()),
(1, 2, 300, 1, NOW(), NOW()),
(2, 3, 200, 1, NOW(), NOW()),
(3, 5, 100, 1, NOW(), NOW());