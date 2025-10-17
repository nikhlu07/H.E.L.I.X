# UI Components (`components/ui/`)

## Overview

UI component library for H.E.L.I.X., based on shadcn/ui with custom components.

## Component Categories

### Form Components
- `button.tsx` - Button variants
- `input.tsx` - Text input
- `textarea.tsx` - Multi-line text input
- `select.tsx` - Dropdown select
- `checkbox.tsx` - Checkbox input
- `radio-group.tsx` - Radio button group
- `switch.tsx` - Toggle switch
- `slider.tsx` - Range slider
- `form.tsx` - Form wrapper

### Layout Components
- `card.tsx` - Card container
- `separator.tsx` - Visual separator
- `tabs.tsx` - Tab navigation
- `accordion.tsx` - Collapsible sections
- `collapsible.tsx` - Collapsible content
- `resizable.tsx` - Resizable panels
- `sidebar.tsx` - Sidebar navigation

### Overlay Components
- `dialog.tsx` - Modal dialog
- `alert-dialog.tsx` - Alert modal
- `sheet.tsx` - Side sheet
- `drawer.tsx` - Bottom drawer
- `popover.tsx` - Popover overlay
- `tooltip.tsx` - Tooltip
- `hover-card.tsx` - Hover card
- `modal.tsx` - Custom modal

### Navigation Components
- `navigation-menu.tsx` - Navigation menu
- `menubar.tsx` - Menu bar
- `dropdown-menu.tsx` - Dropdown menu
- `context-menu.tsx` - Context menu
- `breadcrumb.tsx` - Breadcrumb navigation
- `pagination.tsx` - Pagination controls
- `command.tsx` - Command palette

### Feedback Components
- `toast.tsx` - Toast notifications
- `toaster.tsx` - Toast container
- `sonner.tsx` - Sonner toast
- `alert.tsx` - Alert messages
- `progress.tsx` - Progress bar
- `skeleton.tsx` - Loading skeleton

### Data Display
- `table.tsx` - Data table
- `badge.tsx` - Badge/tag
- `avatar.tsx` - User avatar
- `calendar.tsx` - Date picker
- `chart.tsx` - Chart components
- `scroll-area.tsx` - Scrollable area

### Custom Components
- `lamp.tsx` - Lamp animation effect
- `globe-feature-section.tsx` - Globe visualization
- `timeline-animation.tsx` - Timeline animation
- `vertical-cut-reveal.tsx` - Reveal animation
- `testimonials.tsx` - Testimonial cards
- `case-studies.tsx` - Case study cards
- `pricing-section-2.tsx` - Pricing section
- `featured-section-stats.tsx` - Stats section
- `stacked-circular-footer.tsx` - Footer design
- `invite-member-modal.tsx` - Invite modal
- `icons.tsx` - Icon components

### Utilities
- `use-toast.ts` - Toast hook
- `carousel.tsx` - Carousel component
- `aspect-ratio.tsx` - Aspect ratio wrapper
- `toggle.tsx` - Toggle button
- `toggle-group.tsx` - Toggle group
- `input-otp.tsx` - OTP input
- `label.tsx` - Form label

## Usage

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

<Card>
  <CardHeader>
    <CardTitle>Login</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="Enter principal ID" />
    <Button>Submit</Button>
  </CardContent>
</Card>
```

## Styling

All components use Tailwind CSS and support:
- Dark mode
- Custom variants
- Responsive design
- Accessibility (ARIA)

## Related Documentation

- [Common Components](../common/README.md) - Shared components
- [Dashboard Components](../Dashboard/README.md) - Dashboard UI
