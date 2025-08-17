openapi: 3.0.3
info:
  title: Expense Splitter API
  description: |
    API documentation for managing users, groups, and expenses (equal & custom split).
    
    ## How to Use
    1. Save this file as `openapi.yaml` (or `.json`)
    2. Install `drf-yasg` or `drf-spectacular` in Django for built-in Swagger UI, or
    3. Run it in Swagger Editor 👉 https://editor.swagger.io
    
    You'll get an interactive API playground where you can test all endpoints with JWT authentication.
  version: 1.0.0
  contact:
    name: Manu Bharadwaj
    url: https://manu-bharadwaj-portfolio.vercel.app/portfolio
    email: manu@example.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: http://127.0.0.1:8000/api
    description: Local Development Server
  - url: https://your-production-domain.com/api
    description: Production Server

tags:
  - name: Users
    description: User authentication and profile management APIs
  - name: Groups
    description: Group creation, management, and member operations
  - name: Expenses
    description: Expense management, splits, and financial summaries

paths:
  /users/register/:
    post:
      tags: [Users]
      summary: Register a new user
      description: Create a new user account with username, email, and password
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, email, password]
              properties:
                username:
                  type: string
                  example: johndoe
                  description: Unique username for the user
                email:
                  type: string
                  format: email
                  example: john@example.com
                  description: User's email address
                password:
                  type: string
                  format: password
                  example: securepassword123
                  description: User's password (minimum 8 characters)
      responses:
        '201':
          description: User registered successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: User registered successfully
                  user_id:
                    type: integer
                    example: 1
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Username already exists

  /users/token/:
    post:
      tags: [Users]
      summary: Login with JWT
      description: Authenticate user and receive JWT access and refresh tokens
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, password]
              properties:
                username:
                  type: string
                  example: johndoe
                  description: User's username
                password:
                  type: string
                  format: password
                  example: securepassword123
                  description: User's password
      responses:
        '200':
          description: JWT tokens generated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  refresh:
                    type: string
                    example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
                    description: JWT refresh token (valid for 7 days)
                  access:
                    type: string
                    example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
                    description: JWT access token (valid for 1 hour)
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Invalid username or password

  /users/token/refresh/:
    post:
      tags: [Users]
      summary: Refresh JWT access token
      description: Get a new access token using the refresh token
      operationId: refreshToken
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [refresh]
              properties:
                refresh:
                  type: string
                  example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
                  description: Valid JWT refresh token
      responses:
        '200':
          description: New access token generated
          content:
            application/json:
              schema:
                type: object
                properties:
                  access:
                    type: string
                    example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
                    description: New JWT access token
        '401':
          description: Invalid or expired refresh token

  /users/profile/:
    get:
      tags: [Users]
      summary: Get logged-in user profile
      description: Retrieve the current authenticated user's profile information
      operationId: getUserProfile
      security:
        - bearerAuth: []
      responses:
        '200':
          description: User profile details
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                    example: 1
                  username:
                    type: string
                    example: johndoe
                  email:
                    type: string
                    example: john@example.com
                  date_joined:
                    type: string
                    format: date-time
                    example: 2024-01-15T10:30:00Z
        '401':
          description: Unauthorized - Invalid or missing JWT token

  /groups/:
    get:
      tags: [Groups]
      summary: Get all groups
      description: Retrieve all groups that the authenticated user is a member of
      operationId: getAllGroups
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of user's groups
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                      example: 1
                    name:
                      type: string
                      example: "Trip to Goa"
                    created_by:
                      type: integer
                      example: 1
                    created_at:
                      type: string
                      format: date-time
                    member_count:
                      type: integer
                      example: 4
    post:
      tags: [Groups]
      summary: Create a new group
      description: Create a new expense group
      operationId: createGroup
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name]
              properties:
                name:
                  type: string
                  example: "Weekend Trip"
                  description: Name of the group
                description:
                  type: string
                  example: "Expenses for our weekend getaway"
                  description: Optional group description
      responses:
        '201':
          description: Group created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                    example: 1
                  name:
                    type: string
                    example: "Weekend Trip"
                  created_by:
                    type: integer
                    example: 1

  /groups/{id}/:
    get:
      tags: [Groups]
      summary: Get group details
      description: Retrieve detailed information about a specific group
      operationId: getGroupDetails
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
            example: 1
          description: Group ID
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Group details
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                    example: 1
                  name:
                    type: string
                    example: "Trip to Goa"
                  description:
                    type: string
                    example: "Annual group trip"
                  created_by:
                    type: integer
                    example: 1
                  created_at:
                    type: string
                    format: date-time
                  members:
                    type: array
                    items:
                      type: object
                      properties:
                        user_id:
                          type: integer
                        username:
                          type: string
        '404':
          description: Group not found
        '403':
          description: Access denied - User is not a member of this group

  /groups/{id}/add-member/:
    post:
      tags: [Groups]
      summary: Add member to group
      description: Add a new member to an existing group
      operationId: addGroupMember
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
            example: 1
          description: Group ID
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [user_id]
              properties:
                user_id:
                  type: integer
                  example: 2
                  description: ID of the user to add to the group
      responses:
        '200':
          description: Member added successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Member added successfully
        '400':
          description: Invalid data or user already in group
        '404':
          description: Group or user not found

  /groups/{id}/members/:
    get:
      tags: [Groups]
      summary: List group members
      description: Get all members of a specific group
      operationId: getGroupMembers
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
            example: 1
          description: Group ID
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of group members
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    user_id:
                      type: integer
                      example: 1
                    username:
                      type: string
                      example: johndoe
                    email:
                      type: string
                      example: john@example.com
                    joined_at:
                      type: string
                      format: date-time

  /groups/{id}/delete/:
    delete:
      tags: [Groups]
      summary: Delete a group
      description: Delete a group (only group creator can delete)
      operationId: deleteGroup
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
            example: 1
          description: Group ID
      security:
        - bearerAuth: []
      responses:
        '204':
          description: Group deleted successfully
        '403':
          description: Access denied - Only group creator can delete
        '404':
          description: Group not found

  /groups/{id}/expenses/:
    get:
      tags: [Expenses]
      summary: Get all expenses for a group
      description: Retrieve all expenses recorded for a specific group
      operationId: getGroupExpenses
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
            example: 1
          description: Group ID
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of group expenses
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                      example: 1
                    amount:
                      type: number
                      format: float
                      example: 1500.50
                    description:
                      type: string
                      example: "Hotel booking"
                    split_type:
                      type: string
                      enum: [equal, custom]
                      example: equal
                    paid_by:
                      type: integer
                      example: 1
                    created_at:
                      type: string
                      format: date-time
                    splits:
                      type: array
                      items:
                        type: object
                        properties:
                          user_id:
                            type: integer
                          amount_owed:
                            type: number
                            format: float

  /groups/{id}/add-expense/:
    post:
      tags: [Expenses]
      summary: Add expense to a group
      description: Add a new expense with equal or custom split among group members
      operationId: addGroupExpense
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
            example: 1
          description: Group ID
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [amount, description, split_type]
              properties:
                amount:
                  type: number
                  format: float
                  example: 1200.00
                  description: Total expense amount
                description:
                  type: string
                  example: "Dinner at restaurant"
                  description: Description of the expense
                split_type:
                  type: string
                  enum: [equal, custom]
                  example: equal
                  description: Type of split (equal or custom)
                contributions:
                  type: array
                  description: Required only for custom split type
                  items:
                    type: object
                    required: [user_id, amount]
                    properties:
                      user_id:
                        type: integer
                        example: 1
                        description: ID of the user
                      amount:
                        type: number
                        format: float
                        example: 400.00
                        description: Amount this user owes
            examples:
              equal_split:
                summary: Equal Split Example
                value:
                  amount: 1200.00
                  description: "Group dinner"
                  split_type: "equal"
              custom_split:
                summary: Custom Split Example
                value:
                  amount: 1200.00
                  description: "Groceries"
                  split_type: "custom"
                  contributions:
                    - user_id: 1
                      amount: 500.00
                    - user_id: 2
                      amount: 400.00
                    - user_id: 3
                      amount: 300.00
      responses:
        '201':
          description: Expense added successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                    example: 1
                  message:
                    type: string
                    example: Expense added successfully
        '400':
          description: Invalid data (e.g., custom split amounts don't match total)
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Custom split amounts don't match total expense

  /groups/{id}/summary/:
    get:
      tags: [Expenses]
      summary: Get group expense summary
      description: Get detailed balance summary showing who owes whom and how much
      operationId: getGroupSummary
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
            example: 1
          description: Group ID
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Balance summary with detailed breakdowns
          content:
            application/json:
              schema:
                type: object
                properties:
                  group_id:
                    type: integer
                    example: 1
                  group_name:
                    type: string
                    example: "Trip to Goa"
                  total_expenses:
                    type: number
                    format: float
                    example: 5000.00
                  member_balances:
                    type: array
                    items:
                      type: object
                      properties:
                        user_id:
                          type: integer
                          example: 1
                        username:
                          type: string
                          example: johndoe
                        total_paid:
                          type: number
                          format: float
                          example: 2000.00
                        total_owed:
                          type: number
                          format: float
                          example: 1250.00
                        balance:
                          type: number
                          format: float
                          example: 750.00
                          description: Positive means they are owed money, negative means they owe money
                  settlements:
                    type: array
                    description: Simplified settlement suggestions
                    items:
                      type: object
                      properties:
                        from_user:
                          type: string
                          example: alice
                        to_user:
                          type: string
                          example: johndoe
                        amount:
                          type: number
                          format: float
                          example: 250.00

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        JWT Authentication. 
        
        **How to use:**
        1. Login via `/users/token/` to get access token
        2. Click "Authorize" button above
        3. Enter: `Bearer <your_access_token>`
        4. Now you can test all protected endpoints!

  schemas:
    Error:
      type: object
      properties:
        error:
          type: string
          description: Error message
        details:
          type: string
          description: Additional error details (optional)
      example:
        error: "Validation failed"
        details: "Username is required"

    User:
      type: object
      properties:
        id:
          type: integer
          example: 1
        username:
          type: string
          example: johndoe
        email:
          type: string
          format: email
          example: john@example.com
        date_joined:
          type: string
          format: date-time

    Group:
      type: object
      properties:
        id:
          type: integer
          example: 1
        name:
          type: string
          example: "Weekend Trip"
        description:
          type: string
          example: "Expenses for our weekend getaway"
        created_by:
          type: integer
          example: 1
        created_at:
          type: string
          format: date-time
        member_count:
          type: integer
          example: 4

    Expense:
      type: object
      properties:
        id:
          type: integer
          example: 1
        amount:
          type: number
          format: float
          example: 1500.50
        description:
          type: string
          example: "Hotel booking"
        split_type:
          type: string
          enum: [equal, custom]
        paid_by:
          type: integer
          example: 1
        group:
          type: integer
          example: 1
        created_at:
          type: string
          format: date-time