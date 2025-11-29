import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as DiIcons from "react-icons/di";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as SiIcons from "react-icons/si";

const allIcons = {
  ...FaIcons,
  ...SiIcons,
  ...AiIcons,
  ...IoIcons,
  ...RiIcons,
  ...BsIcons,
  ...MdIcons,
  ...DiIcons,
};

export function getIconComponent(iconName) {
  return allIcons[iconName] || FaIcons.FaQuestionCircle;
}
