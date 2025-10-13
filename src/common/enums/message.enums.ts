// Error messages
export enum ErrorMessage {
  // User errors
  USER_NOT_FOUND = 'User not found',
  USER_ALREADY_EXISTS = 'User already exists',
  INVALID_CREDENTIALS = 'Invalid username or password',
  CONFIRM_PASSWORD_UNMATCHED = 'Confirm password does not match',
  FORBIDDEN_PROFILE = 'You can only view your own profile',
  USER_INACTIVE = 'User is inactive',
  EMAIL_IS_REQUIRED = 'Email is required',
  PASSWORD_IS_REQUIRED = 'Password is required',

  // Property errors
  PROP_NOT_FOUND = 'Property not found',
  PROP_ALREADY_EXISTS = 'Property already exists',
  PROP_NOT_OWNED = 'You do not own this property',

  // Property errors
  ROOM_NOT_FOUND = 'Room not found',
  ROOM_NOT_OWNED = 'Room not owned',
  ROOM_NOT_AVAILABLE = 'Room not available',
  ROOM_TYPE_NOT_FOUND = 'Room type not found',
  ROOM_TYPE_NOT_OWNED = 'Room type not owned',

  // Booking
  BOOKING_NOT_FOUND = 'Booking record not found',
  BOOKING_CANT_BE_CANCELLED = 'Booking cannot be cancelled at this stage',

  // Chat Module errors
  CHAT_ROOM_NOT_FOUND = 'Chat Room not found',
  MESSAGE_SENT_TOO_FAST = 'Message sent too fast',

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
