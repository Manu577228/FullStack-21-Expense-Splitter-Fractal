
# ----------------------------------------------------------------------------
#   ( The Authentic JS/JAVA/PYTHON CodeBuff )
#  ___ _                      _              _ 
#  | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
#  | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
#  |___/_||_\__,_|_| \__,_\__,_|_/\_/\__,_|/ |
#                                         |__/
# ----------------------------------------------------------------------------

from pathlib import Path
from datetime import timedelta
import os
import dj_database_url

from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent


# ----------------------------------------------------------------------------
# SECURITY SETTINGS
# ----------------------------------------------------------------------------

DEBUG = os.environ.get("DEBUG", "True").lower() == "true"

SECRET_KEY = os.environ.get("SECRET_KEY")

if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "django-insecure-local-development-key-123456"
    else:
        raise ImproperlyConfigured(
            "SECRET_KEY environment variable must be set in production."
        )

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    ".onrender.com",
]


# ----------------------------------------------------------------------------
# INSTALLED APPLICATIONS
# ----------------------------------------------------------------------------

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party applications
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",

    # Local applications
    "users",
    "expenses",
    "groups",
]


# ----------------------------------------------------------------------------
# MIDDLEWARE
# ----------------------------------------------------------------------------

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",

    "whitenoise.middleware.WhiteNoiseMiddleware",

    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ----------------------------------------------------------------------------
# URL CONFIGURATION
# ----------------------------------------------------------------------------

ROOT_URLCONF = "backend.urls"


# ----------------------------------------------------------------------------
# TEMPLATES
# ----------------------------------------------------------------------------

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


WSGI_APPLICATION = "backend.wsgi.application"


# ----------------------------------------------------------------------------
# DATABASE CONFIGURATION
# SQLite for local development
# PostgreSQL for Render using DATABASE_URL
# ----------------------------------------------------------------------------

DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# ----------------------------------------------------------------------------
# PASSWORD VALIDATION
# ----------------------------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# ----------------------------------------------------------------------------
# INTERNATIONALIZATION
# ----------------------------------------------------------------------------

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# ----------------------------------------------------------------------------
# STATIC FILES CONFIGURATION
# ----------------------------------------------------------------------------

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "staticfiles"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}


# ----------------------------------------------------------------------------
# MEDIA FILES
# ----------------------------------------------------------------------------

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"


# ----------------------------------------------------------------------------
# DEFAULT PRIMARY KEY
# ----------------------------------------------------------------------------

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ----------------------------------------------------------------------------
# DJANGO REST FRAMEWORK
# ----------------------------------------------------------------------------

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}


# ----------------------------------------------------------------------------
# JWT CONFIGURATION
# ----------------------------------------------------------------------------

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# ----------------------------------------------------------------------------
# CORS CONFIGURATION
# ----------------------------------------------------------------------------

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://expense-splitter-fractal-manu-bharadwaj.vercel.app",
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.vercel\.app$",
]


# ----------------------------------------------------------------------------
# CSRF CONFIGURATION
# ----------------------------------------------------------------------------

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://*.onrender.com",
    "https://*.vercel.app",
]
