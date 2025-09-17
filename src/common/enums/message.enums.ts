// Error messages
export enum ErrorMessage {
  // User errors
  USER_NOT_FOUND = 'User not found',
  USER_ALREADY_EXISTS = 'User already exists',
  INVALID_CREDENTIALS = 'Invalid username or password',
  CONFIRM_PASSWORD_UNMATCHED = 'Confirm password does not match',
  FORBIDDEN_PROFILE = 'You can only view your own profile',
  USER_INACTIVE = 'User is inactive',

  // Auth / Token errors
  TOKEN_INVALID_OR_EXPIRED = 'Token invalid or expired',
  TOKEN_NOT_PROVIDED = 'No token provided',
  TOKEN_REVOKED = 'Token revoked or expired',

  // General errors
  INVALID_INPUT = 'Invalid input provided',
  OPERATION_FAILED = 'Operation failed, please try again',
  ROLE_NOT_FOUND = 'Role not found in database',
  IMG_FILES_ONLY = 'Only image files are allowed (jpg, jpeg, png)',
}

// Success / Info messages
export enum Message {
  // User messages
  USER_CREATED = 'User created successfully',
  USER_UPDATED = 'User updated successfully',
  USER_DELETED = 'User deleted successfully',
}
