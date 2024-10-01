import { StoryFn, StoryObj } from '@storybook/react';

import ThemeSwitcher from './ThemeSwitcher';

export default {
  title: 'Components/ThemeSwitcher',
  component: ThemeSwitcher,
} as StoryObj<typeof ThemeSwitcher>;

const Template: StoryFn<typeof ThemeSwitcher> = function Template() {
  return <ThemeSwitcher />;
};

export const ThemeSwitcherPrimary = Template.bind({});
ThemeSwitcherPrimary.args = {};
