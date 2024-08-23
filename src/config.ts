import { z } from 'zod'
import logo from '@/assets/images/logo.png'

const ConfigSchema = z.object({
  logo: z.string(),
  sidebar: z.object({
    items: z.array(
      z.object({
        label: z.string(),
        path: z.string(),
        iconName: z.string(),
        iconNamespace: z.string().optional(),
        tooltip: z.string().optional(),
      })
    ),
    account: z.object({
      options: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      ),
    }),
  }),
})

export type Config = z.infer<typeof ConfigSchema>

export const config = ConfigSchema.parse({
  logo,
  sidebar: {
    items: [
      {
        label: 'Home',
        path: '/layout/home',
        iconName: 'home',
        tooltip: 'Home Tooltip'
      },
      {
        label: 'Setting',
        path: '/layout/setting',
        iconName: 'cog',
        tooltip: 'Setting Tooltip'
      },
    ],
    account: {
      options: [
        {
          label: 'Switch Theme',
          value: 'switch-theme',
        },
        {
          label: 'Sign Out',
          value: 'sign-out',
        },
      ],
    },
  },
} satisfies Config)
