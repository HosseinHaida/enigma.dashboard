export class Challenge {
  constructor(
    public id: number,
    public gameId: number,
    public gameName: string,
    public gamePhotoPath: string,
    public slug: string,
    public progress: number,
    public isFilled: boolean,
    public startTime: Date
  ) {}
}
