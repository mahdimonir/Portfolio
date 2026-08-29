import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as BiIcon from "react-icons/bi";
import * as CiIcon from "react-icons/ci";
import * as CgIcon from "react-icons/cg";
import * as DiIcons from "react-icons/di";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as FcIcons from "react-icons/fc";
import * as FiIcons from "react-icons/fi";
import * as GiIcons from "react-icons/gi";
import * as GoIcons from "react-icons/go";
import * as GrIcons from "react-icons/gr";
import * as HiIcons from "react-icons/hi";
import * as Hi2Icons from "react-icons/hi2";
import * as ImIcons from "react-icons/im";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";
import * as LiaIcons from "react-icons/lia";
import * as LuIcons from "react-icons/lu";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as SiIcons from "react-icons/si";
import * as TbBrandIcon from "react-icons/tb";

const allIcons = {
  ...FaIcons,
  ...Fa6Icons,
  ...SiIcons,
  ...AiIcons,
  ...IoIcons,
  ...RiIcons,
  ...BsIcons,
  ...BiIcon,
  ...MdIcons,
  ...DiIcons,
  ...TbBrandIcon,
  ...CiIcon,
  ...CgIcon,
  ...FcIcon,
  ...FiIcons,
  ...GiIcons,
  ...GoIcons,
  ...GrIcons,
  ...HiIcons,
  ...Hi2Icons,
  ...ImIcons,
  ...LiaIcons,
  ...LuIcons,
  
};

export function getIconComponent(iconName) {
  return allIcons[iconName] || FaIcons.FaQuestionCircle;
}
