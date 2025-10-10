export class RoomDto {
  roomId: string;
  roomNumber: string;
}

export class BookingItemDto {
  room: RoomDto;
}
