import { HvHeader, HvButton } from '@hitachivantara/uikit-react-core';
import { Menu } from '@mui/material';
import { CollapsibleIcons } from '../Navigations/CollapsibleIcons'; // Import the CollapsibleIcons component

function Header() {
  return (
    <div>
      <HvHeader position="relative">
        <HvButton
          aria-label="Menu"
          icon
          onClick={function ks() {}}
          style={{
            height: 32,
            width: 32,
          }}
        >
          <Menu open={false} />
        </HvButton>
      </HvHeader>
      <div
        style={{
          display: 'flex',
          height: 'calc(300px - var(--uikit-header-height))',
        }}
      >
        {/* Integrate CollapsibleIcons instead of the previous vertical navigation */}
        <CollapsibleIcons />
      </div>
    </div>
  );
}

export default Header;
