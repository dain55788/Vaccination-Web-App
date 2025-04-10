from datetime import datetime, timedelta
import os
import json
import sys
import django
from dotenv import load_dotenv

# Add the project directory to the sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vac_backend.airflow_mysql_settings')
django.setup()

# Now import your Django models
from vac_management.models import Appointment, Citizen, Staff

load_dotenv()

APPOINTMENTS_FILE = os.getenv("APPOINTMENTS_FILE_PATH")


def get_valid_appointments():
    try:
        today = datetime.now().date()
        next_day = today + timedelta(days=1)
        print(f"Filtering appointments for date: {next_day}")
        
        # Get appointments scheduled for tomorrow
        appointments = Appointment.objects.filter(scheduled_date=next_day, active=True)
        print(f"Found {len(appointments)} appointments for tomorrow")
        
        return list(appointments)
    except Exception as e:
        print(f"Error getting valid appointments: {str(e)}")
        return []


def save_appointments_to_json():
    try:
        valid_appointments = get_valid_appointments()

        appointments_data = {
            "sum_number_of_arrangements": len(valid_appointments),
            "arrangements": []
        }

        for app in valid_appointments:
            # Get the citizen information
            citizen = app.citizen
            
            appointments_data["arrangements"].append({
                "id": app.id,
                "scheduled_date": str(app.scheduled_date),
                "location": app.location,
                "notes": app.notes if app.notes else "",
                "citizen_id": app.citizen_id,
                "staff_id": app.staff_id,
                # Add citizen information needed for email
                "email": citizen.email,
                "patient_name": f"{citizen.first_name} {citizen.last_name}",
                "phone": citizen.phone_number
            })

        os.makedirs(os.path.dirname(APPOINTMENTS_FILE), exist_ok=True)
        with open(APPOINTMENTS_FILE, "w", encoding="utf-8") as file:
            json.dump(appointments_data, file, indent=4, ensure_ascii=False)

        print(f"Valid appointments saved to {APPOINTMENTS_FILE}")
        return True
    except Exception as e:
        print(f"Error saving appointments to JSON: {str(e)}")
        return False
