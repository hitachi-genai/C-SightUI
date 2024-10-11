import { useState } from "react";
import "./CollapsibleIcons.css";
import {
  HvVerticalNavigation,
  HvVerticalNavigationAction,
  HvVerticalNavigationActions,
  HvVerticalNavigationHeader,
  HvVerticalNavigationTree,
} from "@hitachivantara/uikit-react-core";
import { BarChart, LogOut, User, Preview, DatabaseView, Cash } from "@hitachivantara/uikit-react-icons";

// Navigation data
const navigationData = [
  { id: "00", label: "Dashboard", icon: <DatabaseView /> },
  {
    id: "01",
    label: "Essential Views",
    icon: <Preview />,
    data: [
      { id: "01-01", label: "Quick Insights", icon: <BarChart /> },
      { id: "01-02", label: "Infrastructure Costs" },
      { id: "01-03", label: "Usage Stats" },
      { id: "01-04", label: "GenAI Revenue", icon: <Cash /> },
    ],
  },
  {
    id: "02",
    label: "Consultancy Add-Ons",
    icon: <BarChart />,
    data: [
      { id: "02-01", label: "NPS Scores", icon: <BarChart /> },
      { id: "02-02", label: "Staff Costs", icon: <User /> },
      { id: "02-03", label: "Productivity Gains" },
    ],
  },
];

interface CollapsibleIconsProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export const CollapsibleIcons: React.FC<CollapsibleIconsProps> = ({ isOpen, toggleMenu }) => {
  const [value, setValue] = useState("01-01");

  return (
    <div style={{ height: "100%", minWidth: isOpen ? "300px" : "60px", display: "flex", flexDirection: "column" }}>
      <HvVerticalNavigation open={isOpen} useIcons aria-label="" className="hvVerticalNavigation">
        <HvVerticalNavigationHeader
          title="C-Sight"
          onCollapseButtonClick={toggleMenu}
          collapseButtonProps={{
            "aria-label": "collapseButton",
            "aria-expanded": isOpen,
          }}
          className="hvVerticalNavigationHeader"
        />
        <HvVerticalNavigationTree
          collapsible
          style={{ flexGrow: 1 }}
          defaultExpanded
          selected={value}
          onChange={(event, data) => setValue(data.id)}
          data={navigationData}
        />
        <HvVerticalNavigationActions>
          <HvVerticalNavigationAction label="Profile" icon={<User />} />
          <HvVerticalNavigationAction label="Logout" icon={<LogOut />} />
        </HvVerticalNavigationActions>
      </HvVerticalNavigation>
    </div>
  );
};
