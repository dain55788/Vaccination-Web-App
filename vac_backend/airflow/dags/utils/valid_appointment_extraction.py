from datetime import datetime, timedelta
import os
import json
import sys
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
load_dotenv()
APPOINTMENTS_FILE = os.getenv("APPOINTMENTS_FILE_PATH")

DB_CONFIG = {
    'host': 'host.docker.internal',
    'port': 3306,
    'user': 'root',
    'password': f'{os.getenv('MYSQLPASSWORD')}',
    'database': f'{os.getenv('DATABASE')}'
}


def get_citizen_info(connection, citizen_id):
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)

        sql_query = """
        SELECT 
            id,
            email,
            first_name,
            last_name,
            phone_number
        FROM vac_management_baseuser
        WHERE id = %s
        """

        cursor.execute(sql_query, (citizen_id,))
        citizen = cursor.fetchone()

        return citizen

    except mysql.connector.Error as e:
        print(f"MySQL Error getting citizen info: {e}")
        return None
    except Exception as e:
        print(f"Error getting citizen info: {str(e)}")
        return None
    finally:
        if cursor:
            cursor.close()

def get_mysql_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL: {e}")
        raise

def get_valid_appointments():
    connection = None
    cursor = None

    try:
        today = datetime.now().date()
        next_day = today + timedelta(days=1)
        print(f"Filtering appointments for date: {next_day}")

        sql_query = """
        SELECT 
            id,
            scheduled_date,
            location,
            notes,
            citizen_id,
            staff_id,
            active
        FROM vac_management_appointment
        WHERE DATE(scheduled_date) = %s 
        AND active = 1
        """
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(sql_query, (next_day,))
        appointments = cursor.fetchall()

        return appointments

    except mysql.connector.Error as e:
        print(f"MySQL Error: {e}")
        return []
    except Exception as e:
        print(f"Error getting valid appointments: {str(e)}")
        return []
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("MySQL connection closed")

def save_appointments_to_json():
    try:
        valid_appointments = get_valid_appointments()

        appointments_data = {
            "sum_number_of_appointments": len(valid_appointments),
            "appointments": []
        }

        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)

        for app in valid_appointments:
            citizen = get_citizen_info(connection, app['citizen_id'])
            # appointments_data["appointments"].append({
            #     "id": app.id,
            #     "scheduled_date": str(app.scheduled_date),
            #     "location": app.location,
            #     "notes": app.notes if app.notes else "NO COMMENT",
            #     "citizen_id": app.citizen_id,
            #     "staff_id": app.staff_id,
            #     "email": citizen.email,
            #     "patient_name": f"{citizen.first_name} {citizen.last_name}",
            #     "phone": citizen.phone_number
            # })
            appointments_data["appointments"].append({
                "id": app['id'],
                "scheduled_date": str(app['scheduled_date']),
                "location": app['location'],
                "notes": app['notes'] if app['notes'] else "NO COMMENT",
                "citizen_id": app['citizen_id'],
                "staff_id": app['staff_id'],
                "email": citizen['email'],
                "patient_name": f"{citizen['first_name']} {citizen['last_name']}",
                "phone": citizen['phone_number']
            })

        os.makedirs(os.path.dirname(APPOINTMENTS_FILE), exist_ok=True)
        with open(APPOINTMENTS_FILE, "w", encoding="utf-8") as file:
            json.dump(appointments_data, file, indent=4, ensure_ascii=False)

        print(f"Valid appointments saved to {APPOINTMENTS_FILE}")
        return True
    except Exception as e:
        print(f"Error saving appointments to JSON: {str(e)}")
        return False
