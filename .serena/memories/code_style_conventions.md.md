# Code Style and Conventions

## TypeScript Configuration
- **Target**: ES2017
- **Strict Mode**: Enabled
- **Module Resolution**: Bundler
- **Path Aliases**: `@/*` maps to `./src/*`
- **JSX**: Preserve mode for Next.js

## Component Structure
- **Functional Components**: All components use React functional components with hooks
- **Component Naming**: PascalCase for components (e.g., `SearchFilters`, `TripPlanner`)
- **File Naming**: kebab-case for files (e.g., `search-filters.tsx`, `trip-planner.tsx`)
- **Props Interfaces**: Always define props with TypeScript interfaces suffixed with `Props`
  ```tsx
  interface ComponentNameProps {
    prop1: string;
    prop2?: number;
  }
  ```

## UI Components Library (shadcn/ui)
- Extensive set of pre-built UI components in `src/components/ui/`
- Components use Radix UI primitives with Tailwind CSS styling
- All UI components follow consistent patterns:
  - ForwardRef for DOM element props
  - `cn()` utility for className merging
  - Variant props using class-variance-authority (CVA)

## Styling Conventions
- **Tailwind CSS**: Primary styling solution
- **CSS Classes**: Use Tailwind utility classes
- **Custom Styles**: Defined in `globals.css` with CSS variables
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Dark Mode**: Supported via `next-themes` package

## State Management
- **Local State**: useState and useReducer hooks
- **Form State**: react-hook-form with zod validation
- **Context**: React Context for sidebar and other shared state

## API Routes Pattern
```tsx
export async function GET(request: Request, ctx: CloudflareContext) {
  // Implementation
}

export async function POST(request: Request, ctx: CloudflareContext) {
  // Implementation
}
```

## Error Handling
- Currently, TypeScript and ESLint errors are ignored during build (temporary)
- TODO: Remove ignore flags and fix all errors:
  ```ts
  eslint: { ignoreDuringBuilds: true }
  typescript: { ignoreBuildErrors: true }
  ```

## Import Organization
1. External packages
2. Next.js imports
3. Component imports
4. Utility/lib imports
5. Type imports

## Component Best Practices
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use proper TypeScript types for all props and state
- Implement proper loading and error states
- Add accessibility attributes (aria-labels, roles)