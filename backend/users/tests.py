# ----------------------------------------------------------------------------
#   ( The Authentic JS/JAVA/PYTHON CodeBuff )
#  ___ _                      _              _ 
#  | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
#  | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
#  |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
#                                         |__/ 
# ----------------------------------------------------------------------------

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User


class UsersAPITestCase(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.profile_url = reverse('get_profile')
        self.user_data = {
            "username": "testuser",
            "password": "TestPass123",
            "email": "testuser@example.com",
            "first_name": "Test"
        }

    def test_register_user(self):
        """Test user registration endpoint"""
        response = self.client.post(self.register_url, self.user_data, format='json')
        print(response.data)  # debug if needed
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username=self.user_data['username']).exists())

    def test_login_user(self):
        """Test JWT login endpoint"""
        # First, create the user
        User.objects.create_user(**self.user_data)
        login_data = {
            "username": self.user_data['username'],
            "password": self.user_data['password']
        }
        response = self.client.post(reverse('token_obtain_pair'), login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_get_profile_requires_auth(self):
        """Test profile endpoint requires authentication"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_profile_authenticated(self):
        """Test fetching user profile after login"""
        user = User.objects.create_user(**self.user_data)
        # Obtain JWT token
        response = self.client.post(reverse('token_obtain_pair'), {
            "username": self.user_data['username'],
            "password": self.user_data['password']
        }, format='json')
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user_data['username'])
        self.assertEqual(response.data['email'], self.user_data['email'])
