export interface MessageInResponse {
  id: number;
  createdAt: Date;
  owner: {
    username: string;
    id: number;
  };
  text: string;
  toUserId?: number;
  toRoomId?: number;
  listOfReaders: [];
}
