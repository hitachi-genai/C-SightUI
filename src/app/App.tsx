import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { genAITheme, ThemeNames } from '@hitachi-genai/uikit-core';
import { HvProvider ,HvHeader} from '@hitachivantara/uikit-react-core';
import I18nextProvider from 'common/lib/i18n';
import { CollapsibleIcons } from "../shared/components/Navigations/CollapsibleIcons";
import AppRoutes from "../routes/AppRoutes"; 
import Footer from '../shared/components/Footer/Footer';
import { QueryClient, QueryClientProvider } from 'react-query';


const App: React.FC = () => {
  
  const [isOpen, setIsOpen] = React.useState(true);
  const queryClient = new QueryClient();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
      <I18nextProvider>
        <QueryClientProvider client={queryClient}>
          <HvProvider
            themes={[genAITheme]} 
            theme={ThemeNames.GenAI}
            rootElementId="root"
            cssTheme="scoped"
          >
            <Router>
              <div style={{ display: 'flex', flexDirection: 'column', height: '105vh', backgroundColor: 'white' }}>
                <HvHeader position="relative" style={{ backgroundColor: '#1976d2' }}>
                  <h1 className="logo">C.Sight</h1>
                </HvHeader>
                <div style={{ display: "flex", height: "200vh" }}>
                  {/* Collapsible Menu */}
                  <CollapsibleIcons isOpen={isOpen} toggleMenu={toggleMenu} />
  
                  {/* Main content area where routes will be rendered */}
                  <div style={{ flexGrow: 1, padding: "20px" }}>
                    <AppRoutes /> {/* App routes are rendered here */}
                  </div>
                </div>
                <Footer />
              </div>
            </Router>
          </HvProvider>
        </QueryClientProvider>
      </I18nextProvider>
    );
  };
  
  export default App;
