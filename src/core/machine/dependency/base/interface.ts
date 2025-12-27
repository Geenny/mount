import { BaseDependency } from 'core/dependency/base/BaseDependency';
import { DependencyName } from 'core/dependency/enums';

export interface IBaseDependencyMachine {
  getDependentDependencies(name: DependencyName): BaseDependency[];
  getDependents(name: DependencyName): BaseDependency[];
}