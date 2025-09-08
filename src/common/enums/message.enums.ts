// Error messages
export enum ErrorMessage {
  // User errors
  USER_NOT_FOUND = 'User not found',
  USER_ALREADY_EXISTS = 'User already exists',
  INVALID_CREDENTIALS = 'Invalid username or password',
  CONFIRM_PASSWORD_UNMATCHED = 'Confirm password does not match',
  FORBIDDEN_PROFILE = 'You can only view your own profile',
  USER_INACTIVE = 'User is inactive',

  // Job related errors
  JOB_NOT_FOUND = 'Job not found',
  APPLICATION_NOT_FOUND = 'Application not found',

  // Auth / Token errors
  TOKEN_INVALID_OR_EXPIRED = 'Token invalid or expired',
  TOKEN_NOT_PROVIDED = 'No token provided',
  TOKEN_REVOKED = 'Token revoked or expired',

  // General errors
  INVALID_INPUT = 'Invalid input provided',
  OPERATION_FAILED = 'Operation failed, please try again',
}

// Success / Info messages
export enum Message {
  // User messages
  USER_CREATED = 'User created successfully',
  USER_UPDATED = 'User updated successfully',
  USER_DELETED = 'User deleted successfully',

  // Job messages
  JOB_CREATED = 'Job created successfully',
  JOB_UPDATED = 'Job updated successfully',
  JOB_DELETED = 'Job deleted successfully',

  // Post messages
  POST_CREATED = 'Post created successfully',
  POST_UPDATED = 'Post updated successfully',
  POST_DELETED = 'Post deleted successfully',

  // Application messages
  APPLICATION_SUBMITTED = 'Application submitted successfully',
  APPLICATION_UPDATED = 'Application updated successfully',
  APPLICATION_DELETED = 'Application deleted successfully',
}
