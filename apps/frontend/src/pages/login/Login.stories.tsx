import type { Meta, StoryObj } from '@storybook/react';
import { HeroUIProvider } from '@heroui/react';

import { LoginForm as Login } from './Login';

const meta = {
  title: 'Pages/Login',
  component: Login,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [(Story) => <HeroUIProvider>{Story()}</HeroUIProvider>],
} satisfies Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    onLoginSubmit: async (_) => {
      return 'access_token';
    },
  },
};

export const InvalidCredentials: Story = {
  args: {
    onLoginSubmit: async (_) => {
      return undefined;
    },
  },
};

export const ServiceNotAvailable: Story = {
  args: {
    onLoginSubmit: async (_) => {
      throw new Error("I'm a teapot");
    },
  },
};
