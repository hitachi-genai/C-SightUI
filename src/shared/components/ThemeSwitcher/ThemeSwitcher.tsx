import { ThemeTypes } from '@hitachi-genai/uikit-core';
import { HvSwitch, useTheme } from '@hitachivantara/uikit-react-core';

/**
 * ThemeSwitcher component.
 * Test component, will be removed.
 */
function ThemeSwitcher() {
  const { selectedTheme, selectedMode, changeTheme } = useTheme();
  const invertTheme = () => {
    changeTheme(
      selectedTheme,
      selectedMode === ThemeTypes.Wicked ? ThemeTypes.Dawn : ThemeTypes.Wicked,
    );
  };

  return <HvSwitch value="on" onChange={invertTheme} />;
}

export default ThemeSwitcher;
