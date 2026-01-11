import { BaseController } from "./BaseController";
import { BaseModel } from "./BaseModel";
import { BaseView } from "./BaseView";

type ComponentControllerInstanceType = { controller: typeof BaseController };
type ComponentModelInstanceType = { model?: typeof BaseModel };
type ComponentViewInstanceType = { view?: typeof BaseView };

type ComponentMVCInstanceType = ComponentControllerInstanceType & ComponentModelInstanceType & ComponentViewInstanceType;
type ComponentMVInstanceType = ComponentModelInstanceType & ComponentViewInstanceType;

export { ComponentMVCInstanceType, ComponentMVInstanceType };