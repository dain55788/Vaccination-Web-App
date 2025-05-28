from airflow.operators.python import PythonOperator
from airflow.operators.empty import EmptyOperator
from airflow.utils.dates import days_ago
from datetime import timedelta
from airflow import DAG
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.valid_appointment_extraction import save_appointments_to_json
from utils.appointment_email_sender import send_emails

# default arguments of a DAG
default_args = {
    'owner': 'DainyNguyen',
    'depends_on_past': False,
    'start_date': days_ago(0),
    'email': ['dain55788@gmail.com'],
    'email_on_failure': True,
    'email_on_retry': True,
    'retries': 1,
    'retry_delay': timedelta(seconds=10),
    'catchup_by_default': False
}

with DAG(
        'Appointments_Email',
        description='Automatically sending injection appointment announcement email to patient ',
        default_args=default_args,
        schedule_interval='0 11 * * *',
        tags=['appointments_email_sendgrid'],
        catchup=False, ) as dag:  # for preventing backfilling

    start_pipeline = EmptyOperator(
        task_id="start_pipeline"
    )

    save_appointments_to_json = PythonOperator(
        task_id="save_appointments_to_json",
        python_callable=save_appointments_to_json
    )

    send_emails = PythonOperator(
        task_id="send_emails_to_patients",
        python_callable=send_emails
    )

    end_pipeline = EmptyOperator(
        task_id="end_pipeline"
    )

    start_pipeline >> save_appointments_to_json >> send_emails >> end_pipeline