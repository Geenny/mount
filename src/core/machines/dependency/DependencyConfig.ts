export interface DependencyConfig {
  name: string;
  factory: () => any;
  dependencies?: string[];
}