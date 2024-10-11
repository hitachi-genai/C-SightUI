import { StoryFn, StoryObj } from '@storybook/react';

import TempComponent from './TempComponent';

export default {
  title: 'Components/TempComponent',
  component: TempComponent,
} as StoryObj<typeof TempComponent>;

const Template: StoryFn<typeof TempComponent> = function Template() {
  return <TempComponent />;
};

export const TempComponentPrimary = Template.bind({});
TempComponentPrimary.args = {};
