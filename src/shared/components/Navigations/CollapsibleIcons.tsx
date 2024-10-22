import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CollapsibleIcons.css";
import {
  HvVerticalNavigation,
  HvVerticalNavigationAction,
  HvVerticalNavigationActions,
  HvVerticalNavigationHeader,
  HvVerticalNavigationTree,
} from "@hitachivantara/uikit-react-core";
import { BarChart, LogOut, User, Preview, Cash } from "@hitachivantara/uikit-react-icons";

// Navigation data with paths for routing
const navigationData = [
  {
    id: "01",
    label: "Essential Views",
    icon: <Preview />,
    data: [
      { id: "01-01", label: "Quick Insights", icon: <BarChart />, path: "/quick-insights" },
      { id: "01-02", label: "Infrastructure Costs", path: "/infrastructure-costs" },
      { id: "01-03", label: "Usage Stats", path: "/usage-stats" },
      { id: "01-04", label: "GenAI Revenue", icon: <Cash />, path: "/genai-revenue" },
    ],
  },
  {
    id: "02",
    label: "Consultancy Add-Ons",
    icon: <BarChart />,
    data: [
      { id: "02-01", label: "NPS Scores", icon: <BarChart />, path: "/nps-scores" },
      { id: "02-02", label: "Staff Costs", icon: <User />, path: "/staff-costs" },
      { id: "02-03", label: "Productivity Gains", path: "/productivity-gains" },
    ],
  },
];

interface CollapsibleIconsProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export const CollapsibleIcons: React.FC<CollapsibleIconsProps> = ({ isOpen, toggleMenu }) => {
  const [value, setValue] = useState("01-01");
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current location

  const handleNavigation = (id: string, path: string | undefined) => {
    setValue(id);
    if (path) {
      navigate(path); // Redirect to the specified path
    }
  };

  useEffect(() => {
    // Set the active item based on the current pathname
    const currentPath = location.pathname;
    const found = navigationData.some(category =>
      category.data.some(item => {
        if (item.path === currentPath) {
          setValue(item.id);
          return true;
        }
        return false;
      })
    );

    // Default to Quick Insights if no path matched
    if (!found) {
      setValue("01-01"); // Set this to the default active ID
    }
  }, [location.pathname]); // Re-run when the pathname changes

  return (
    <div style={{ height: "100%", minWidth: isOpen ? "300px" : "60px", display: "flex", flexDirection: "column" }}>
      <HvVerticalNavigation open={isOpen} useIcons aria-label="" className="hvVerticalNavigation">
        <HvVerticalNavigationHeader
          title="Dashboard"
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
          onChange={(_event, data) => handleNavigation(data.id, data.path)} // Pass both id and path
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
