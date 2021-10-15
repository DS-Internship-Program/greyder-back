export class CreatePostDto{
  readonly userId: number
  readonly tableName: string
  readonly isWrite: boolean
  readonly isRead: boolean
}