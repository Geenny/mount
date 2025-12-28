import { BaseDependency } from 'core/dependency/base/BaseDependency';
import { DependencyName } from 'core/dependency/enums';

export interface IBaseDependencyMachine {
  getDependentDependencies(dependency: BaseDependency): BaseDependency[];
  getDependentDependencyByName(dependencyName: DependencyName): BaseDependency;
}