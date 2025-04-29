# CRONTAB - CRONJOB FOR APPOINTMENT EMAIL SENDER

## crontab -e, crontab -l :)

## Possible schedule for the task:

## Extract valid appointment
```shell
    * 6 * * * python valid_appointment_extraction.py
```

## Send email to citizen
```shell
    1 6 * * * python appointment_email_sender.py
```
