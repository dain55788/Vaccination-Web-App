from datetime import datetime, timedelta
import json
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("SENDGRID_API_KEY")
APPOINTMENTS_FILE = os.getenv("APPOINTMENTS_FILE_PATH")


def email(app, to_mail):
    try:
        # ssl._create_default_https_context = ssl._create_unverified_context
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import (Mail, Attachment, FileContent, FileName, FileType, Disposition)
        import base64

        if not api_key:
            raise ValueError("SendGrid API key is missing or empty")

        message = Mail(
            from_email='dainnguyen1307@gmail.com',
            to_emails=to_mail,
            subject='Nhắc Nhở Lịch Tiêm Chủng',
            html_content='<img src="https://static.vecteezy.com/system/resources/previews/019/956/427/non_2x/healthy-food-logo-premium-vector.jpg"'
                         'style="width:300px; height:auto;">'
                         '<h1> Nhắc nhở lịch tiêm chủng </h1>'
                         f'<br>Tên bệnh nhân: <b>{app["patient_name"]}</b><br>'
                         f'<br>Số điện thoại: <b>{app["phone"]}</b><br>'
                         f'<br>Ngày hẹn tiêm: <b>{app["scheduled_date"]}</b><br>'
                         f'<br>Địa điểm: Khách hàng vui lòng đến địa chỉ này nhé: <b>{app["location"]}</b><br>'
                         f'<br>Ghi chú: {app["notes"]}<br>'
                         f'<br>Lưu ý: Nhớ mang theo <b>CĂN CƯỚC CÔNG DÂN</b> và <b>BẢO HIỂM Y TẾ</b> bạn nhé!!<br>'
        )

        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        return True
    except Exception as e:
        print(f"Error sending email to {to_mail}: {str(e)}")
        return False


def send_emails():
    try:
        with open(APPOINTMENTS_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)

        valid_appointments = data.get("appointments", [])
        if not valid_appointments:
            print("No appointments found to send emails for")
            return
        patient_email = None
        for app in valid_appointments:
            try:
                patient_email = app.get("email")
                if not patient_email:
                    print(f"Missing email for patient: {app.get('patient_name', 'Unknown')}")
                    continue

                print(f"Sending email to: {patient_email} for patient: {app['patient_name']}")
                email(app, patient_email)
                print(f"Successfully sent email to {patient_email}")
            except Exception as e:
                print(f"Error sending email to {patient_email}: {str(e)}")
    except Exception as e:
        print(f"Error in send_emails function: {str(e)}")

# Execution
send_emails()
