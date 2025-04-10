from .settings import *

# Override database settings for local development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'vaccination_management',
        'USER': 'root',
        'PASSWORD': '123456',
        'HOST': 'host.docker.internal',
        'PORT': '3306',
    }
}

# Add other settings specific to local environment
DEBUG = True

# Email settings for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend' 