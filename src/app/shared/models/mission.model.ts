export class Mission {
  constructor(
    public id: string,
    public uid: string,
    public level: number,
    public name: string,
    public photoPath: string,
    public slug: string,
    public script: string,
    public key: string,
  ) { }
}
