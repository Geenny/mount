import { BaseController } from "./BaseController";
import { BaseModel } from "./BaseModel";
import { BaseView } from "./BaseView";

type ComponentClassesType = { Controller: typeof BaseController, Model: typeof BaseModel, View: typeof BaseView };

export { ComponentClassesType };