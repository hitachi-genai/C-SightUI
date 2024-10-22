import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { genAITheme, ThemeNames } from '@hitachi-genai/uikit-core';
import { HvProvider } from '@hitachivantara/uikit-react-core';
import I18nextProvider from 'common/lib/i18n';
import { CollapsibleIcons } from "../src/shared/components/Navigations/CollapsibleIcons";
import AppRoutes from "./routes/AppRoutes"; 

const App: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <I18nextProvider>
    <HvProvider
      themes={[genAITheme]} 
      theme={ThemeNames.GenAI}
      rootElementId="root"
      cssTheme="scoped"
    >
      <Router>
        <div style={{ display: "flex", height: "100vh" }}>
          {/* Collapsible Menu */}
          <CollapsibleIcons isOpen={isOpen} toggleMenu={toggleMenu} />

          {/* Main content area where routes will be rendered */}
          <div style={{ flexGrow: 1, padding: "20px" }}>
            <AppRoutes /> {/* App routes are rendered here */}
          </div>
        </div>
      </Router>
    </HvProvider>
  </I18nextProvider>
);
};

export default App;
