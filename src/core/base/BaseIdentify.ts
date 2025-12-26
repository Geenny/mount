export abstract class BaseIdentify {
  public readonly ID: string;
  public readonly name: string;

  constructor(props: { ID: string; name: string }) {
    this.ID = props.ID;
    this.name = props.name;
  }
}