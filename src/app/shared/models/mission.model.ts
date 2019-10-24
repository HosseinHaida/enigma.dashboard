export class Mission {
  constructor(
    public id: number,
    public level: number,
    public name: string,
    public photoPath: string,
    public slug: string,
    public script: string,
    public key: string,
  ) {}
}
