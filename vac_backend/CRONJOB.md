# Crontab - Cronjob for Appointment Email Sending

## Getting started
### In your terminal, press this command to open crontab command language interface

```shell
crontab -e
```

### Use this command to see your current existing cronjob

```shell
crontab -l
```

## Possible schedule for the task:

### Extract valid appointment
```shell
* 6 * * * python valid_appointment_extraction.py
```

### Send email to citizen
```shell
1 6 * * * python appointment_email_sender.py
```
