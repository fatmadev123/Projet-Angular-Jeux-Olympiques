
import { Participation } from './Participation';
export class Olympics {
  constructor(
    public id: number,
    public country: string,
    public participations: Participation[]
  ) {}
}
