import os
import django
import datetime
from django.utils import timezone
from django.db import connection

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vac_backend.settings')
django.setup()

# For password hashing
from django.contrib.auth.hashers import make_password

# Clear existing data
def clear_data():
    print("Clearing existing data...")
    with connection.cursor() as cursor:
        # Disable foreign key checks to allow deleting in any order
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
        
        cursor.execute("DELETE FROM vac_management_campaignvaccine;")
        cursor.execute("DELETE FROM vac_management_campaigncitizen;")
        cursor.execute("DELETE FROM vac_management_appointmentvaccine;")
        cursor.execute("DELETE FROM vac_management_appointment;")
        cursor.execute("DELETE FROM vac_management_campaign;")
        cursor.execute("DELETE FROM vac_management_vaccine;")
        cursor.execute("DELETE FROM vac_management_vaccinecategory;")
        cursor.execute("DELETE FROM vac_management_doctor;")
        cursor.execute("DELETE FROM vac_management_staff;")
        cursor.execute("DELETE FROM vac_management_citizen;")
        cursor.execute("DELETE FROM auth_user;")
        
        # Reset auto-increment counters
        cursor.execute("ALTER TABLE vac_management_vaccinecategory AUTO_INCREMENT = 1;")
        cursor.execute("ALTER TABLE vac_management_vaccine AUTO_INCREMENT = 1;")
        cursor.execute("ALTER TABLE vac_management_campaign AUTO_INCREMENT = 1;")
        cursor.execute("ALTER TABLE vac_management_appointment AUTO_INCREMENT = 1;")
        cursor.execute("ALTER TABLE vac_management_appointmentvaccine AUTO_INCREMENT = 1;")
        cursor.execute("ALTER TABLE vac_management_campaignvaccine AUTO_INCREMENT = 1;")
        cursor.execute("ALTER TABLE vac_management_campaigncitizen AUTO_INCREMENT = 1;")
        cursor.execute("ALTER TABLE auth_user AUTO_INCREMENT = 1;")
        
        # Re-enable foreign key checks
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
    
    print("All data cleared.")

# Create Vaccine Categories
def create_vaccine_categories():
    print("Creating vaccine categories...")
    categories = [
        {'category_name': 'COVID-19'},
        {'category_name': 'Influenza'},
        {'category_name': 'Hepatitis'},
        {'category_name': 'Measles'},
        {'category_name': 'Polio'},
    ]
    
    category_ids = []
    with connection.cursor() as cursor:
        for cat in categories:
            cursor.execute(
                "INSERT INTO vac_management_vaccinecategory (category_name, active, created_date, updated_date) "
                "VALUES (%s, 1, NOW(), NOW())",
                [cat['category_name']]
            )
            category_ids.append(cursor.lastrowid)
    
    print(f"Created {len(categories)} vaccine categories.")
    return category_ids

# Create Vaccines
def create_vaccines(category_ids):
    print("Creating vaccines...")
    vaccines = [
        {
            'category_id': category_ids[0],  # COVID-19
            'vaccine_name': 'Pfizer-BioNTech',
            'dose_quantity': 2,
            'instruction': 'Administer intramuscularly in the deltoid. Second dose after 21 days.',
            'unit_price': 20.00
        },
        {
            'category_id': category_ids[0],  # COVID-19
            'vaccine_name': 'Moderna',
            'dose_quantity': 2,
            'instruction': 'Administer intramuscularly in the deltoid. Second dose after 28 days.',
            'unit_price': 25.00
        },
        {
            'category_id': category_ids[1],  # Influenza
            'vaccine_name': 'Fluzone',
            'dose_quantity': 1,
            'instruction': 'Administer intramuscularly in the deltoid. Annual vaccination recommended.',
            'unit_price': 15.00
        },
        {
            'category_id': category_ids[2],  # Hepatitis
            'vaccine_name': 'Hepatitis A',
            'dose_quantity': 2,
            'instruction': 'Administer intramuscularly. Second dose after 6-12 months.',
            'unit_price': 30.00
        },
        {
            'category_id': category_ids[3],  # Measles
            'vaccine_name': 'MMR (Measles, Mumps, Rubella)',
            'dose_quantity': 2,
            'instruction': 'Administer subcutaneously. Second dose at 4-6 years of age.',
            'unit_price': 22.00
        },
    ]
    
    vaccine_ids = []
    with connection.cursor() as cursor:
        for vac in vaccines:
            cursor.execute(
                "INSERT INTO vac_management_vaccine (category_id, vaccine_name, dose_quantity, instruction, unit_price, image, active, created_date, updated_date) "
                "VALUES (%s, %s, %s, %s, %s, NULL, 1, NOW(), NOW())",
                [vac['category_id'], vac['vaccine_name'], vac['dose_quantity'], vac['instruction'], vac['unit_price']]
            )
            vaccine_ids.append(cursor.lastrowid)
    
    print(f"Created {len(vaccines)} vaccines.")
    return vaccine_ids

# Create Citizens
def create_citizens():
    print("Creating citizens...")
    citizens = [
        {
            'username': 'john_doe',
            'password': make_password('password123'),
            'email': 'john.doe@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'date_of_birth': '1985-05-15',
            'phone_number': '555-123-4567',
            'address': '123 Main St, Anytown, USA',
            'gender': 'male',
            'health_note': 'No known allergies'
        },
        {
            'username': 'jane_smith',
            'password': make_password('password123'),
            'email': 'jane.smith@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'date_of_birth': '1990-08-22',
            'phone_number': '555-987-6543',
            'address': '456 Oak Ave, Somewhere, USA',
            'gender': 'female',
            'health_note': 'Penicillin allergy'
        },
        {
            'username': 'robert_johnson',
            'password': make_password('password123'),
            'email': 'robert.johnson@example.com',
            'first_name': 'Robert',
            'last_name': 'Johnson',
            'date_of_birth': '1978-03-10',
            'phone_number': '555-456-7890',
            'address': '789 Pine Rd, Elsewhere, USA',
            'gender': 'male',
            'health_note': 'Asthma'
        },
    ]
    
    citizen_ids = []
    with connection.cursor() as cursor:
        for citizen in citizens:
            # First create auth_user record
            cursor.execute(
                "INSERT INTO auth_user (username, password, email, first_name, last_name, is_staff, is_active, is_superuser, date_joined, last_login) "
                "VALUES (%s, %s, %s, %s, %s, 0, 1, 0, NOW(), NOW())",
                [citizen['username'], citizen['password'], citizen['email'], citizen['first_name'], citizen['last_name']]
            )
            user_id = cursor.lastrowid
            
            # Then create citizen record
            cursor.execute(
                "INSERT INTO vac_management_citizen (baseuser_ptr_id, date_of_birth, avatar, phone_number, address, gender, health_note) "
                "VALUES (%s, %s, NULL, %s, %s, %s, %s)",
                [user_id, citizen['date_of_birth'], citizen['phone_number'], citizen['address'], citizen['gender'], citizen['health_note']]
            )
            citizen_ids.append(user_id)
    
    print(f"Created {len(citizens)} citizens.")
    return citizen_ids

# Create Staff
def create_staff():
    print("Creating staff...")
    staff = [
        {
            'username': 'staff_alex',
            'password': make_password('password123'),
            'email': 'alex.staff@example.com',
            'first_name': 'Alex',
            'last_name': 'Johnson',
            'date_of_birth': '1988-06-12',
            'phone_number': '555-111-2222',
            'address': '101 Staff St, Anytown, USA',
            'gender': 'male',
            'shift': 'morning',
            'hire_date': '2019-03-15'
        },
        {
            'username': 'staff_sarah',
            'password': make_password('password123'),
            'email': 'sarah.staff@example.com',
            'first_name': 'Sarah',
            'last_name': 'Williams',
            'date_of_birth': '1992-09-05',
            'phone_number': '555-333-4444',
            'address': '202 Staff Ave, Somewhere, USA',
            'gender': 'female',
            'shift': 'afternoon',
            'hire_date': '2020-05-10'
        },
    ]
    
    staff_ids = []
    with connection.cursor() as cursor:
        for s in staff:
            # First create auth_user record
            cursor.execute(
                "INSERT INTO auth_user (username, password, email, first_name, last_name, is_staff, is_active, is_superuser, date_joined, last_login) "
                "VALUES (%s, %s, %s, %s, %s, 1, 1, 0, NOW(), NOW())",
                [s['username'], s['password'], s['email'], s['first_name'], s['last_name']]
            )
            user_id = cursor.lastrowid
            
            # Then create staff record
            cursor.execute(
                "INSERT INTO vac_management_staff (baseuser_ptr_id, date_of_birth, avatar, phone_number, address, gender, shift, hire_date) "
                "VALUES (%s, %s, NULL, %s, %s, %s, %s, %s)",
                [user_id, s['date_of_birth'], s['phone_number'], s['address'], s['gender'], s['shift'], s['hire_date']]
            )
            staff_ids.append(user_id)
    
    print(f"Created {len(staff)} staff members.")
    return staff_ids

# Create Doctors
def create_doctors():
    print("Creating doctors...")
    doctors = [
        {
            'username': 'dr_smith',
            'password': make_password('password123'),
            'email': 'dr.smith@example.com',
            'first_name': 'Michael',
            'last_name': 'Smith',
            'date_of_birth': '1975-04-20',
            'phone_number': '555-777-8888',
            'address': '303 Doctor Blvd, Anytown, USA',
            'gender': 'male',
            'specialty': 'Immunology',
            'years_of_experience': 15,
            'medical_license': 'MED12345'
        },
        {
            'username': 'dr_johnson',
            'password': make_password('password123'),
            'email': 'dr.johnson@example.com',
            'first_name': 'Emily',
            'last_name': 'Johnson',
            'date_of_birth': '1983-11-08',
            'phone_number': '555-999-0000',
            'address': '404 Doctor Ln, Somewhere, USA',
            'gender': 'female',
            'specialty': 'Pediatrics',
            'years_of_experience': 10,
            'medical_license': 'MED67890'
        },
    ]
    
    doctor_ids = []
    with connection.cursor() as cursor:
        for doc in doctors:
            # First create auth_user record
            cursor.execute(
                "INSERT INTO auth_user (username, password, email, first_name, last_name, is_staff, is_active, is_superuser, date_joined, last_login) "
                "VALUES (%s, %s, %s, %s, %s, 1, 1, 0, NOW(), NOW())",
                [doc['username'], doc['password'], doc['email'], doc['first_name'], doc['last_name']]
            )
            user_id = cursor.lastrowid
            
            # Then create doctor record
            cursor.execute(
                "INSERT INTO vac_management_doctor (baseuser_ptr_id, date_of_birth, avatar, phone_number, address, gender, specialty, years_of_experience, medical_license) "
                "VALUES (%s, %s, NULL, %s, %s, %s, %s, %s, %s)",
                [user_id, doc['date_of_birth'], doc['phone_number'], doc['address'], doc['gender'], doc['specialty'], doc['years_of_experience'], doc['medical_license']]
            )
            doctor_ids.append(user_id)
    
    print(f"Created {len(doctors)} doctors.")
    return doctor_ids

# Create Campaigns
def create_campaigns():
    print("Creating campaigns...")
    campaigns = [
        {
            'campaign_name': 'COVID-19 Mass Vaccination',
            'start_date': '2023-01-15',
            'end_date': '2023-03-15',
            'description': 'A community-wide initiative to vaccinate against COVID-19.',
            'target_population': 10000,
            'status': 'completed'
        },
        {
            'campaign_name': 'Annual Flu Prevention',
            'start_date': datetime.date.today().strftime('%Y-%m-%d'),
            'end_date': (datetime.date.today() + datetime.timedelta(days=60)).strftime('%Y-%m-%d'),
            'description': 'Annual campaign to administer flu vaccines before the winter season.',
            'target_population': 5000,
            'status': 'ongoing'
        },
        {
            'campaign_name': 'School Vaccination Drive',
            'start_date': (datetime.date.today() + datetime.timedelta(days=30)).strftime('%Y-%m-%d'),
            'end_date': (datetime.date.today() + datetime.timedelta(days=90)).strftime('%Y-%m-%d'),
            'description': 'Vaccination program for school-aged children.',
            'target_population': 3000,
            'status': 'planned'
        },
    ]
    
    campaign_ids = []
    with connection.cursor() as cursor:
        for camp in campaigns:
            cursor.execute(
                "INSERT INTO vac_management_campaign (campaign_name, start_date, end_date, description, image, target_population, status, active, created_date, updated_date) "
                "VALUES (%s, %s, %s, %s, NULL, %s, %s, 1, NOW(), NOW())",
                [camp['campaign_name'], camp['start_date'], camp['end_date'], camp['description'], camp['target_population'], camp['status']]
            )
            campaign_ids.append(cursor.lastrowid)
    
    print(f"Created {len(campaigns)} campaigns.")
    return campaign_ids

# Create Appointments
def create_appointments(citizen_ids, staff_ids):
    print("Creating appointments...")
    appointments = [
        {
            'citizen_id': citizen_ids[0],  # John Doe
            'scheduled_date': (datetime.date.today() + datetime.timedelta(days=5)).strftime('%Y-%m-%d'),
            'staff_id': staff_ids[0],  # Alex
            'location': 'Main Clinic, Room 101',
            'notes': 'First appointment'
        },
        {
            'citizen_id': citizen_ids[1],  # Jane Smith
            'scheduled_date': (datetime.date.today() + datetime.timedelta(days=7)).strftime('%Y-%m-%d'),
            'staff_id': staff_ids[1],  # Sarah
            'location': 'Community Health Center',
            'notes': 'Follow-up appointment'
        },
        {
            'citizen_id': citizen_ids[2],  # Robert Johnson
            'scheduled_date': (datetime.date.today() + datetime.timedelta(days=10)).strftime('%Y-%m-%d'),
            'staff_id': staff_ids[0],  # Alex
            'location': 'Main Clinic, Room 105',
            'notes': 'Initial consultation'
        },
    ]
    
    appointment_ids = []
    with connection.cursor() as cursor:
        for app in appointments:
            cursor.execute(
                "INSERT INTO vac_management_appointment (citizen_id, scheduled_date, staff_id, location, notes, active, created_date, updated_date) "
                "VALUES (%s, %s, %s, %s, %s, 1, NOW(), NOW())",
                [app['citizen_id'], app['scheduled_date'], app['staff_id'], app['location'], app['notes']]
            )
            appointment_ids.append(cursor.lastrowid)
    
    print(f"Created {len(appointments)} appointments.")
    return appointment_ids

# Create Appointment Vaccines
def create_appointment_vaccines(appointment_ids, vaccine_ids, doctor_ids):
    print("Creating appointment vaccines...")
    appointment_vaccines = [
        {
            'appointment_id': appointment_ids[0],
            'vaccine_id': vaccine_ids[0],  # Pfizer
            'doctor_id': doctor_ids[0],  # Dr. Smith
            'dose_quantity_used': 1,
            'status': 'scheduled',
            'notes': 'First dose',
            'cost': 20.00
        },
        {
            'appointment_id': appointment_ids[1],
            'vaccine_id': vaccine_ids[2],  # Fluzone
            'doctor_id': doctor_ids[1],  # Dr. Johnson
            'dose_quantity_used': 1,
            'status': 'completed',
            'notes': 'Annual flu shot',
            'cost': 15.00
        },
        {
            'appointment_id': appointment_ids[2],
            'vaccine_id': vaccine_ids[3],  # Hepatitis A
            'doctor_id': doctor_ids[0],  # Dr. Smith
            'dose_quantity_used': 1,
            'status': 'scheduled',
            'notes': 'First dose of series',
            'cost': 30.00
        },
    ]
    
    with connection.cursor() as cursor:
        for apv in appointment_vaccines:
            cursor.execute(
                "INSERT INTO vac_management_appointmentvaccine (appointment_id, vaccine_id, doctor_id, dose_quantity_used, status, notes, cost, active, created_date, updated_date) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, 1, NOW(), NOW())",
                [apv['appointment_id'], apv['vaccine_id'], apv['doctor_id'], apv['dose_quantity_used'], apv['status'], apv['notes'], apv['cost']]
            )
    
    print(f"Created {len(appointment_vaccines)} appointment vaccines.")

# Create Campaign Citizens
def create_campaign_citizens(campaign_ids, citizen_ids):
    print("Creating campaign citizens...")
    campaign_citizens = [
        {
            'campaign_id': campaign_ids[0],  # COVID-19
            'citizen_id': citizen_ids[0],  # John Doe
            'injection_date': '2023-02-15'
        },
        {
            'campaign_id': campaign_ids[0],  # COVID-19
            'citizen_id': citizen_ids[1],  # Jane Smith
            'injection_date': '2023-02-20'
        },
        {
            'campaign_id': campaign_ids[1],  # Flu
            'citizen_id': citizen_ids[2],  # Robert Johnson
            'injection_date': (datetime.date.today() - datetime.timedelta(days=2)).strftime('%Y-%m-%d')
        },
    ]
    
    with connection.cursor() as cursor:
        for cc in campaign_citizens:
            cursor.execute(
                "INSERT INTO vac_management_campaigncitizen (campaign_id, citizen_id, injection_date, active, created_date, updated_date) "
                "VALUES (%s, %s, %s, 1, NOW(), NOW())",
                [cc['campaign_id'], cc['citizen_id'], cc['injection_date']]
            )
    
    print(f"Created {len(campaign_citizens)} campaign citizens.")

# Create Campaign Vaccines
def create_campaign_vaccines(campaign_ids, vaccine_ids):
    print("Creating campaign vaccines...")
    campaign_vaccines = [
        {
            'campaign_id': campaign_ids[0],  # COVID-19
            'vaccine_id': vaccine_ids[0],  # Pfizer
            'dose_quantity_used': 500
        },
        {
            'campaign_id': campaign_ids[0],  # COVID-19
            'vaccine_id': vaccine_ids[1],  # Moderna
            'dose_quantity_used': 300
        },
        {
            'campaign_id': campaign_ids[1],  # Flu
            'vaccine_id': vaccine_ids[2],  # Fluzone
            'dose_quantity_used': 200
        },
        {
            'campaign_id': campaign_ids[2],  # School
            'vaccine_id': vaccine_ids[4],  # MMR
            'dose_quantity_used': 100
        },
    ]
    
    with connection.cursor() as cursor:
        for cv in campaign_vaccines:
            cursor.execute(
                "INSERT INTO vac_management_campaignvaccine (campaign_id, vaccine_id, dose_quantity_used, active, created_date, updated_date) "
                "VALUES (%s, %s, %s, 1, NOW(), NOW())",
                [cv['campaign_id'], cv['vaccine_id'], cv['dose_quantity_used']]
            )
    
    print(f"Created {len(campaign_vaccines)} campaign vaccines.")

# Main function to load all data
def load_sample_data():
    try:
        clear_data()
        category_ids = create_vaccine_categories()
        vaccine_ids = create_vaccines(category_ids)
        citizen_ids = create_citizens()
        staff_ids = create_staff()
        doctor_ids = create_doctors()
        campaign_ids = create_campaigns()
        appointment_ids = create_appointments(citizen_ids, staff_ids)
        create_appointment_vaccines(appointment_ids, vaccine_ids, doctor_ids)
        create_campaign_citizens(campaign_ids, citizen_ids)
        create_campaign_vaccines(campaign_ids, vaccine_ids)
        
        # Commit all changes
        connection.commit()
        print("All sample data loaded successfully!")
    except Exception as e:
        # Rollback in case of error
        connection.rollback()
        print(f"Error occurred: {e}")
        raise

if __name__ == "__main__":
    load_sample_data() 