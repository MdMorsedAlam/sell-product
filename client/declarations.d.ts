// declarations.d.ts or any .d.ts file
declare module "react-awesome-slider/dist/autoplay" {
  import { ComponentType } from "react";
  const withAutoplay: (component: ComponentType) => ComponentType;
  export default withAutoplay;
}
