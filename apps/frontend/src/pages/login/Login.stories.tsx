import type { Meta, StoryObj } from '@storybook/react';
import { HeroUIProvider } from '@heroui/react';

import { LoginForm as Login } from './Login';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';

const meta = {
  title: 'Pages/Login',
  component: Login,
  args: {
    onLoginSubmit: fn(),
    onLoginSuccess: fn(),
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [(Story) => <HeroUIProvider>{Story()}</HeroUIProvider>],
} satisfies Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onLoginSubmit: fn(async () => 'access_token'),
  },
};

export const Success: Story = {
  args: {
    onLoginSubmit: fn(async () => 'access_token'),
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Enter credentials', async () => {
      await userEvent.type(canvas.getByTestId('username'), 'hi@example.com');
      await userEvent.type(canvas.getByTestId('password'), 'supersecret');
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button'));
    });

    await waitFor(() => {
      expect(args.onLoginSubmit).toHaveBeenCalledWith({
        username: 'hi@example.com',
        password: 'supersecret',
      });
      expect(args.onLoginSuccess).toHaveBeenCalled();
    });
  },
};

export const InvalidCredentials: Story = {
  args: {
    onLoginSubmit: fn(async () => undefined),
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Enter credentials', async () => {
      await userEvent.type(
        canvas.getByTestId('username'),
        'invalidUser@example.com',
      );
      await userEvent.type(canvas.getByTestId('password'), 'invalidPassword');
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button'));
    });

    await waitFor(() => {
      expect(args.onLoginSubmit).toHaveBeenCalledWith({
        username: 'invalidUser@example.com',
        password: 'invalidPassword',
      });
      expect(args.onLoginSuccess).not.toHaveBeenCalled();
    });
  },
};

export const ServiceNotAvailable: Story = {
  args: {
    onLoginSubmit: fn(async () => {
      throw new Error(`I'm a Teapot`);
    }),
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Enter credentials', async () => {
      await userEvent.type(canvas.getByTestId('username'), 'bye@example.com');
      await userEvent.type(canvas.getByTestId('password'), 'notSoSecret');
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button'));
    });

    await waitFor(() => {
      expect(args.onLoginSubmit).toHaveBeenCalledWith({
        username: 'bye@example.com',
        password: 'notSoSecret',
      });
      expect(args.onLoginSuccess).not.toHaveBeenCalled();
    });
  },
};
